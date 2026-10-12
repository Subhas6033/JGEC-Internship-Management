import { apiClient } from "../api/apiClient";

export const getStudentDashboard = () => apiClient.get("/dashboard/students");
