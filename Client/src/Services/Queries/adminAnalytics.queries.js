import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics } from "../admin/adminAnalytics.api";

const adminAnalyticsKeys = {
  all: ["admin-analytics"],
  list: (period) => [...adminAnalyticsKeys.all, "list", period],
};

export const useAdminAnalytics = (period = "12m") => {
  return useQuery({
    queryKey: adminAnalyticsKeys.list(period),
    queryFn: () => getAdminAnalytics(period),
    staleTime: 5 * 60 * 1000,
  });
};
