import { useQuery } from "@tanstack/react-query";
import { getSpocDashboard } from "../Dashboard/spocDashboardApi";

const SPOC_DASHBOARD_QUERY_KEY = ["spoc", "dashboard"];

/**
 * Hook to fetch SPOC dashboard data
 * @param {Object} options - Additional query options
 * @returns {Object} React Query result object
 */
export const useSpocDashboard = (options = {}) => {
  return useQuery({
    queryKey: SPOC_DASHBOARD_QUERY_KEY,
    queryFn: getSpocDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
};

/**
 * Hook to get overview statistics from dashboard
 * @returns {Object} Overview stats or null
 */
export const useSpocDashboardOverview = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    overview: data?.overview ?? null,
    ...rest,
  };
};

/**
 * Hook to get application status distribution
 * @returns {Object} Application status data
 */
export const useSpocDashboardApplicationStatus = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    applicationStatus: data?.applicationStatus ?? [],
    ...rest,
  };
};

/**
 * Hook to get monthly applications trend
 * @returns {Object} Monthly applications data
 */
export const useSpocDashboardMonthlyApplications = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    monthlyApplications: data?.monthlyApplications ?? [],
    ...rest,
  };
};

/**
 * Hook to get placement stats
 * @returns {Object} Placement stats
 */
export const useSpocDashboardPlacementStats = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    placementStats: data?.placementStats ?? null,
    ...rest,
  };
};

/**
 * Hook to get recent applications
 * @returns {Object} Recent applications
 */
export const useSpocDashboardRecentApplications = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    recentApplications: data?.recentApplications ?? [],
    ...rest,
  };
};

/**
 * Hook to get pending tasks
 * @returns {Object} Pending tasks
 */
export const useSpocDashboardPendingTasks = () => {
  const { data, ...rest } = useSpocDashboard();
  return {
    pendingTasks: data?.pendingTasks ?? [],
    ...rest,
  };
};
