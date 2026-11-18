import { apiClient } from "../api/apiClient";

export const getAdminDashboard = async (filters = {}) => {
  const response = await apiClient.get("/admin/dashboard", {
    params: filters,
  });

  // Supports an APIRES response envelope and a directly returned payload.
  const dashboardData = response?.data?.data ?? response?.data ?? response;

  if (!dashboardData?.overview) {
    throw new Error("Invalid admin dashboard response");
  }

  return dashboardData;
};
