import { apiClient } from "../api/apiClient";

const ADMIN_AUTH_BASE = "/auth/admin";

const registerAdmin = async (payload) => {
  const response = await apiClient.post(`${ADMIN_AUTH_BASE}/register`, payload);

  return response?.data;
};

const loginAdmin = async (payload) => {
  const response = await apiClient.post(`${ADMIN_AUTH_BASE}/login`, {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  });

  return response?.data;
};

// Shared current-user endpoint; it works for every role.
const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");
  return response?.data?.user;
};

// Shared logout endpoint; backend identifies the refresh cookie.
const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  return response?.data;
};

export { registerAdmin, loginAdmin, getCurrentUser, logoutUser };
