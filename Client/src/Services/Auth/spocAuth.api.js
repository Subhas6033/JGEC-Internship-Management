import { apiClient } from "../api/apiClient";
const SPOC_AUTH_BASE = "/auth/spoc";

const registerSpoc = async (payload) => {
  const response = await apiClient.post(`${SPOC_AUTH_BASE}/register`, payload);
  return response?.data;
};

const loginSpoc = async (payload) => {
  const response = await apiClient.post(`${SPOC_AUTH_BASE}/login`, payload);
  return response?.data;
};

const getCurrentSpoc = async () => {
  const response = await apiClient.get("/auth/me");
  return response?.data;
};

const logoutSpoc = async () => {
  const response = await apiClient.post("/auth/logout");
  return response?.data;
};

const refreshAccessToken = async () => {
  const response = await apiClient.post("/auth/refresh-token");
  return response?.data;
};

export {
  registerSpoc,
  loginSpoc,
  getCurrentSpoc,
  logoutSpoc,
  refreshAccessToken,
};
