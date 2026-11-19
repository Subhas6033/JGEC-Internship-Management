import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStudents,
  updateAdminStudent,
  deleteAdminStudent,
} from "../admin/adminStudents.api";

const adminStudentKeys = {
  all: ["admin-students"],
  lists: () => [...adminStudentKeys.all, "list"],
  list: (params) => [...adminStudentKeys.lists(), params],
};

const useAdminStudents = (params = {}) => {
  return useQuery({
    queryKey: adminStudentKeys.list(params),
    queryFn: () => getAdminStudents(params),
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

const useUpdateAdminStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminStudentKeys.all,
      });
    },
  });
};

const useDeleteAdminStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdminStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminStudentKeys.all,
      });
    },
  });
};

export { useAdminStudents, useUpdateAdminStudent, useDeleteAdminStudent };
