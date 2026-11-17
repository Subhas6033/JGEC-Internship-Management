import { useQuery } from "@tanstack/react-query";
import { getAdminDepartments } from "../admin/adminDepartments.api";

export const adminDepartmentKeys = {
  all: ["admin-departments"],
  list: () => [...adminDepartmentKeys.all, "list"],
};

export const useAdminDepartments = () => {
  return useQuery({
    queryKey: adminDepartmentKeys.list(),
    queryFn: getAdminDepartments,
    staleTime: 5 * 60 * 1000,
  });
};
