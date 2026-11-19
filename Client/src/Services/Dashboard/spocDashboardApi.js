import { apiClient } from "../api/apiClient";

/**
 * Get SPOC Dashboard Data
 * @returns {Promise} The dashboard data response
 */
export const getSpocDashboard = async () => {
  const response = await apiClient.get("/dashboard/spoc");

  // Supports an APIRES response envelope and a directly returned payload.
  const dashboardData = response?.data?.data ?? response?.data ?? response;

  if (!dashboardData?.overview) {
    throw new Error("Invalid SPOC dashboard response");
  }

  return dashboardData;
};
