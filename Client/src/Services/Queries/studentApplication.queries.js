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

const useStudentApplications = () => {
  return useQuery({
    queryKey: ["studentApplications"],
    queryFn: getStudentApplications,
  });
};

const useStudentApplication = (applicationId) => {
  return useQuery({
    queryKey: ["studentApplication", applicationId],
    queryFn: () => getStudentApplicationById(applicationId),
    enabled: Boolean(applicationId),
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
