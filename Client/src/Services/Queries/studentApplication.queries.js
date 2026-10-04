import { useMutation, useQuery } from "@tanstack/react-query";
import {
  submitStudentApplication,
  getStudentApplications,
  getStudentApplicationById,
  withdrawStudentApplication,
} from "../Application/studentApplication.api.js";

/*
 * Submit application
 */
const useSubmitStudentApplication = () => {
  return useMutation({
    mutationFn: submitStudentApplication,
  });
};

/*
 * Get student's applications
 *
 * The filters become part of the React Query key.
 * Whenever search/status/type/sort changes,
 * React Query automatically fetches the corresponding
 * backend data.
 */
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

/*
 * Get single application
 */
const useStudentApplication = (applicationId) => {
  return useQuery({
    queryKey: ["studentApplication", applicationId],
    queryFn: () => getStudentApplicationById(applicationId),
    enabled: Boolean(applicationId),
  });
};

/*
 * Withdraw application
 */
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
