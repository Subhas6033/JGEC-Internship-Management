import axios from "axios";
import { store } from "../../Store/index";
import { setAccessToken, logout } from "../../Store/Slice/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5850/api/v1";

const REFRESH_ENDPOINT = "/auth/students/refresh-token";
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_LOCK_NAME = "student-auth-refresh";

class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

const normalizeError = (error) => {
  if (error instanceof APIError || axios.isCancel(error)) return error;

  if (error.response) {
    const { status, data } = error.response;

    return new APIError(
      data?.message || "Something went wrong. Please try again.",
      status,
      data,
    );
  }

  if (error.code === "ECONNABORTED") {
    return new APIError("The request timed out. Please try again.", 0);
  }

  // status 0 = no response (offline / DNS / CORS)
  return new APIError("Network error. Please check your connection.", 0);
};

/*
 * Main client: attaches the access token, refreshes on 401.
 * No default Content-Type: axios sets JSON for objects and the browser
 * sets the multipart boundary for FormData.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

/*
 * Bare client for the refresh call: NO interceptors,
 * so a failing refresh can never trigger another refresh.
 */
const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});


const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
 * Retries ONLY on 409 (backend says "token was just rotated").
 * The browser re-reads the cookie jar on each attempt, so the retry
 * automatically carries the newest cookie.
 */
const callRefreshEndpoint = async () => {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await authClient.post(REFRESH_ENDPOINT);

      const accessToken = response.data?.data?.accessToken;

      if (!accessToken) {
        throw new APIError("Access token was not returned", 401, response.data);
      }

      return accessToken;
    } catch (error) {
      const apiError = normalizeError(error);

      if (apiError.status === 409 && attempt < MAX_REFRESH_ATTEMPTS) {
        await sleep(150 * attempt + Math.random() * 100);
        continue;
      }

      throw apiError;
    }
  }
};

/*
 * Cross-tab lock: the refresh cookie is shared by every tab, but the
 * single-flight promise is per-tab. The Web Locks API serializes refreshes
 * across tabs so they never race for the same cookie.
 */
const withCrossTabLock = (task) => {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK_NAME, task);
  }

  return task();
};

const requestRefreshToken = () =>
  withCrossTabLock(async () => {
    const accessToken = await callRefreshEndpoint();

    // Only the access token goes to Redux; the refresh token stays in the HttpOnly cookie.
    store.dispatch(setAccessToken(accessToken));

    return accessToken;
  });

/* Per-tab single flight */
let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

// Interceptors
api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;

  if (accessToken && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  // Unwrap: callers receive the response body
  (response) => response.data,

  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const shouldTryRefresh =
      status === 401 &&
      original &&
      !original._retry &&
      !original.skipAuthRefresh;

    if (!shouldTryRefresh) {
      throw normalizeError(error);
    }

    original._retry = true;

    const currentToken = store.getState().auth.accessToken;
    const sentAuthHeader = original.headers?.Authorization;

    let accessToken;

    if (currentToken && sentAuthHeader !== `Bearer ${currentToken}`) {
      // Another request already refreshed while this one was in flight.
      // Don't rotate again; just retry with the current token.
      accessToken = currentToken;
    } else {
      try {
        accessToken = await refreshAccessToken();
      } catch (refreshError) {
        // Log out ONLY when the server definitively says the session is dead.
        if (refreshError.status === 401 || refreshError.status === 403) {
          store.dispatch(logout());
        }

        throw refreshError;
      }
    }

    original.headers.Authorization = `Bearer ${accessToken}`;

    // Errors from the retry are normal request errors; they never cause a logout.
    return api(original);
  },
);

export { api as apiClient, APIError, refreshAccessToken };
