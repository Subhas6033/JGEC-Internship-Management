import axios from "axios";
import { store } from "../../Store/index";
import { setAccessToken, setAuth, logout } from "../../Store/Slice/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5850/api/v1";

const REFRESH_ENDPOINT = "/auth/refresh-token";
const MAX_REFRESH_ATTEMPTS = 3;
const REFRESH_LOCK_NAME = "auth-refresh";

class APIError extends Error {
  constructor(message, status = 500, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

const normalizeError = (error) => {
  if (error instanceof APIError || axios.isCancel(error)) {
    return error;
  }

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

  return new APIError("Network error. Please check your connection.", 0);
};

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

const authClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const callRefreshEndpoint = async () => {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await authClient.post(REFRESH_ENDPOINT);
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

      if (apiError.status === 409 && attempt < MAX_REFRESH_ATTEMPTS) {
        await sleep(150 * attempt + Math.random() * 100);
        continue;
      }
      throw apiError;
    }
  }
};

const withCrossTabLock = (task) => {
  if (typeof navigator !== "undefined" && navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK_NAME, task);
  }

  return task();
};

const requestRefreshToken = () =>
  withCrossTabLock(async () => {
    const result = await callRefreshEndpoint();
    store.dispatch(
      setAuth({
        user: result.user,
        accessToken: result.accessToken,
      }),
    );
    return result;
  });

let refreshPromise = null;

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = requestRefreshToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const accessToken = store.getState().auth.accessToken;
  if (accessToken && !config.headers?.Authorization) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
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
      accessToken = currentToken;
    } else {
      try {
        const refreshResult = await refreshAccessToken();
        accessToken = refreshResult.accessToken;
      } catch (refreshError) {
        if (refreshError.status === 401 || refreshError.status === 403) {
          store.dispatch(logout());
        }
        throw refreshError;
      }
    }

    original.headers = original.headers || {};
    original.headers.Authorization = `Bearer ${accessToken}`;
    return api(original);
  },
);

export { api as apiClient, APIError, refreshAccessToken };
