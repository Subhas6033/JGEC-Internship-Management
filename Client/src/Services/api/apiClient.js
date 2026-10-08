import axios from "axios";
import { store } from "../../Store/index";
import { setAuth, logout } from "../../Store/Slice/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5850/api/v1";

const REFRESH_ENDPOINT = "/auth/refresh-token";

const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_LOCK_NAME = "auth-refresh";

/* -------------------------------------------------------------------------- */
/* API ERROR                                                                   */
/* -------------------------------------------------------------------------- */

class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);

    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

/* -------------------------------------------------------------------------- */
/* ERROR NORMALIZER                                                            */
/* -------------------------------------------------------------------------- */

const normalizeError = (error) => {
  // Already normalized
  if (error instanceof APIError || axios.isCancel(error)) {
    return error;
  }

  // Server responded with an HTTP error
  if (error?.response) {
    const { status, data } = error.response;

    return new APIError(
      data?.message || data?.error || "Something went wrong. Please try again.",
      status,
      data,
    );
  }

  // Timeout
  if (error?.code === "ECONNABORTED") {
    return new APIError("The request timed out. Please try again.", 0);
  }

  // Network error
  return new APIError("Network error. Please check your connection.", 0);
};

/* -------------------------------------------------------------------------- */
/* MAIN API CLIENT                                                             */
/* -------------------------------------------------------------------------- */

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

/* -------------------------------------------------------------------------- */
/* AUTH CLIENT                                                                 */
/*                                                                            */
/* Used only for refresh requests.                                             */
/* It intentionally does NOT use the main API interceptors.                   */
/* -------------------------------------------------------------------------- */

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/* REFRESH TOKEN                                                               */
/* -------------------------------------------------------------------------- */

const callRefreshEndpoint = async () => {
  for (let attempt = 1; attempt <= MAX_REFRESH_ATTEMPTS; attempt++) {
    try {
      const response = await authClient.post(REFRESH_ENDPOINT);

      /*
       * Expected backend response:
       *
       * {
       *   success: true,
       *   data: {
       *     accessToken: "...",
       *     user: {...}
       *   }
       * }
       */

      const data = response?.data?.data;

      const accessToken = data?.accessToken;
      const user = data?.user;

      if (!accessToken) {
        throw new APIError(
          "Access token was not returned",
          401,
          response?.data,
        );
      }

      if (!user) {
        throw new APIError(
          "Authenticated user was not returned",
          401,
          response?.data,
        );
      }

      return {
        accessToken,
        user,
      };
    } catch (error) {
      const apiError = normalizeError(error);

      /*
       * 409 can mean that another request/tab is currently
       * rotating the refresh token.
       *
       * Retry with a small delay.
       */
      if (apiError.status === 409 && attempt < MAX_REFRESH_ATTEMPTS) {
        await sleep(150 * attempt + Math.random() * 100);

        continue;
      }

      throw apiError;
    }
  }

  throw new APIError("Unable to refresh authentication", 401);
};

/* -------------------------------------------------------------------------- */
/* CROSS-TAB REFRESH LOCK                                                      */
/* -------------------------------------------------------------------------- */

const withCrossTabLock = (task) => {
  /*
   * Web Locks API
   *
   * This prevents multiple browser tabs from trying to
   * rotate the refresh token at exactly the same time.
   */
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK_NAME, task);
  }

  return task();
};

/* -------------------------------------------------------------------------- */
/* REFRESH REQUEST                                                             */
/* -------------------------------------------------------------------------- */

const requestRefreshToken = () =>
  withCrossTabLock(async () => {
    const result = await callRefreshEndpoint();

    /*
     * Store the newly generated access token globally.
     *
     * From this point onward, every API request will
     * automatically use the new token.
     */
    store.dispatch(
      setAuth({
        user: result.user,
        accessToken: result.accessToken,
      }),
    );

    return result;
  });

/* -------------------------------------------------------------------------- */
/* SINGLE REFRESH PROMISE                                                      */
/* -------------------------------------------------------------------------- */

/*
 * If 5 API requests receive 401 simultaneously,
 * we DON'T want 5 refresh requests.
 *
 * All requests wait for the same refreshPromise.
 */

let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

/* -------------------------------------------------------------------------- */
/* REQUEST INTERCEPTOR                                                         */
/* -------------------------------------------------------------------------- */

api.interceptors.request.use(
  (config) => {
    /*
     * Read the latest access token directly from Redux.
     *
     * This is important because the token can change after
     * a refresh without recreating the Axios client.
     */
    const accessToken = store.getState()?.auth?.accessToken;

    if (accessToken) {
      config.headers = config.headers || {};

      /*
       * Don't overwrite a manually supplied Authorization
       * header if one already exists.
       */
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(normalizeError(error));
  },
);

/* -------------------------------------------------------------------------- */
/* RESPONSE INTERCEPTOR                                                        */
/* -------------------------------------------------------------------------- */

api.interceptors.response.use(
  /*
   * Successful requests return response.data directly.
   *
   * Therefore React Query hooks receive:
   *
   * {
   *   success: true,
   *   data: ...
   * }
   */
  (response) => response.data,

  /*
   * Failed requests
   */
  async (error) => {
    const originalRequest = error?.config;

    const status = error?.response?.status;

    /*
     * Only refresh for:
     *
     * 401 Unauthorized
     *
     * and only once for the original request.
     */
    const shouldTryRefresh =
      status === 401 &&
      originalRequest &&
      !originalRequest.__retry &&
      !originalRequest.__skipAuthRefresh;

    /*
     * Not an authentication failure.
     */
    if (!shouldTryRefresh) {
      throw normalizeError(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    originalRequest.__retry = true;

    /*
     * Check whether another request has already refreshed
     * the token.
     *
     * If Redux contains a newer token than the one used by
     * the failed request, we can simply retry with it.
     */
    const currentToken = store.getState()?.auth?.accessToken;

    const sentAuthHeader = originalRequest.headers?.Authorization;

    let accessToken;

    if (currentToken && sentAuthHeader !== `Bearer ${currentToken}`) {
      /*
       * Another request already refreshed the token.
       *
       * Reuse the new token instead of refreshing again.
       */
      accessToken = currentToken;
    } else {
      /*
       * Token is still the same, so perform centralized
       * refresh.
       */
      try {
        const refreshResult = await refreshAccessToken();

        accessToken = refreshResult.accessToken;
      } catch (refreshError) {
        /*
         * Refresh token/session is no longer valid.
         *
         * Clear authentication state.
         */
        if (refreshError?.status === 401 || refreshError?.status === 403) {
          store.dispatch(logout());
        }

        throw refreshError;
      }
    }

    /*
     * Retry the original request with the fresh token.
     */
    originalRequest.headers = originalRequest.headers || {};

    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

    return api(originalRequest);
  },
);

/* -------------------------------------------------------------------------- */
/* EXPORTS                                                                     */
/* -------------------------------------------------------------------------- */

export { api as apiClient, APIError, refreshAccessToken };
