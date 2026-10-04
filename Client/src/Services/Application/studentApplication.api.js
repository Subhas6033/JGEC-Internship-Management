import { apiClient } from "../api/apiClient";

const submitStudentApplication = (applicationData) =>
  apiClient.post("/application/students/apply", applicationData);

const getStudentApplications = ({
  search = "",
  status = "all",
  type = "all",
  sort = "newest",
} = {}) =>
  apiClient.get("/application/students/getapplications", {
    params: {
      search: search.trim() || undefined,

      status: status !== "all" ? status : undefined,

      type: type !== "all" ? type : undefined,

      sort,
    },
  });

const getStudentApplicationById = (applicationId) =>
  apiClient.get(`/application/students/${applicationId}`);

const withdrawStudentApplication = (applicationId) =>
  apiClient.patch(`/application/students/${applicationId}/withdraw`);

export {
  submitStudentApplication,
  getStudentApplications,
  getStudentApplicationById,
  withdrawStudentApplication,
};
