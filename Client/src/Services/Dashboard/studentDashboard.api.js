import { apiClient } from "../api/apiClient";

const getStudentDashboard = () => apiClient.get("/dashboard/students");

export { getStudentDashboard };
