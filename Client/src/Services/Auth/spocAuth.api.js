import { apiClient } from "../api/apiClient";

const SPOC_AUTH_BASE = "/auth/spoc";

// Register SPOC.
const registerSpoc = async (payload) => {
  const response = await apiClient.post(`${SPOC_AUTH_BASE}/register`, payload);

  return response.data;
};

// Login SPOC and initiate OTP verification.
const loginSpoc = async (payload) => {
  const response = await apiClient.post(`${SPOC_AUTH_BASE}/login`, payload);

  return response.data;
};

// Get currently authenticated user.
const getCurrentSpoc = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};

// Logout SPOC.
const logoutSpoc = async () => {
  const response = await apiClient.post("/auth/logout");

  return response.data;
};

// Refresh access token.
const refreshAccessToken = async () => {
  const response = await apiClient.post("/auth/refresh-token");

  return response.data;
};

export {
  registerSpoc,
  loginSpoc,
  getCurrentSpoc,
  logoutSpoc,
  refreshAccessToken,
};
