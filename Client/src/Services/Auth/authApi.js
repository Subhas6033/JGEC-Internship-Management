import { apiClient, refreshAccessToken } from "../api/apiClient";

const getCurrentUser = () => apiClient.get("/auth/me");
const refreshAuthToken = () => refreshAccessToken();
const logoutUser = () =>
  apiClient.post("/auth/logout", null, {
    skipAuthRefresh: true,
  });

export { getCurrentUser, refreshAuthToken, logoutUser };
