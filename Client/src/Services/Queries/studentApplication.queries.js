import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitStudentApplication,
  getStudentApplications,
  getStudentApplicationById,
  withdrawStudentApplication,
} from "../Application/studentApplication.api.js";

const useSubmitStudentApplication = () => {
  return useMutation({
    mutationFn: submitStudentApplication,
  });
};

const useStudentApplications = ({
  search = "",
  status = "all",
  type = "all",
  sort = "newest",
} = {}) => {
  return useQuery({
    queryKey: [
      "studentApplications",
      {
        search,
        status,
        type,
        sort,
      },
    ],
    queryFn: () =>
      getStudentApplications({
        search,
        status,
        type,
        sort,
      }),
    staleTime: 30 * 1000,
    placeholderData: (previousData) => previousData,
  });
};

const useStudentApplication = (applicationId) => {
  return useQuery({
    queryKey: ["studentApplication", applicationId],
    queryFn: () => getStudentApplicationById(applicationId),
    enabled: Boolean(applicationId),
    staleTime: 30 * 1000,
  });
};

const useWithdrawStudentApplication = () => {
  return useMutation({
    mutationFn: withdrawStudentApplication,
  });
};

export {
  useSubmitStudentApplication,
  useStudentApplications,
  useStudentApplication,
  useWithdrawStudentApplication,
};
