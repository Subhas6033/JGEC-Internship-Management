import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../Dashboard/adminDashboardApi";

const ADMIN_DASHBOARD_QUERY_KEY = ["admin", "dashboard"];

export const useAdminDashboard = (filters = {}) => {
  return useQuery({
    queryKey: [...ADMIN_DASHBOARD_QUERY_KEY, filters],
    queryFn: () => getAdminDashboard(filters),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
