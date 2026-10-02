import { apiClient } from "../api/apiClient";

const submitStudentApplication = (applicationData) =>
  apiClient.post("/application/students/apply", applicationData);

const getStudentApplications = () => apiClient.get("/application/students");

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