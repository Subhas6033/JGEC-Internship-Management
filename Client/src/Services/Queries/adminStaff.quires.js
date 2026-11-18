import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStaff,
  getAdminStaffStats,
  updateAdminStaff,
  toggleAdminStaffStatus,
} from "../admin/adminStaff.api";

const adminStaffKeys = {
  all: ["admin-staff"],
  lists: () => [...adminStaffKeys.all, "list"],
  list: (params) => [...adminStaffKeys.lists(), params],
  stats: () => [...adminStaffKeys.all, "stats"],
};

const useAdminStaff = (params = {}) => {
  return useQuery({
    queryKey: adminStaffKeys.list(params),
    queryFn: () => getAdminStaff(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

const useAdminStaffStats = () => {
  return useQuery({
    queryKey: adminStaffKeys.stats(),
    queryFn: getAdminStaffStats,
    staleTime: 2 * 60 * 1000,
  });
};

// Invalidating `all` refreshes every list page and the stats together.
const useInvalidateStaff = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: adminStaffKeys.all });
};

const useUpdateAdminStaff = () => {
  const invalidate = useInvalidateStaff();

  return useMutation({
    mutationFn: updateAdminStaff,
    onSuccess: invalidate,
  });
};

const useToggleAdminStaffStatus = () => {
  const invalidate = useInvalidateStaff();

  return useMutation({
    mutationFn: toggleAdminStaffStatus,
    onSuccess: invalidate,
  });
};

export {
  adminStaffKeys,
  useAdminStaff,
  useAdminStaffStats,
  useUpdateAdminStaff,
  useToggleAdminStaffStatus,
};
