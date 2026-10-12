import { apiClient } from "../api/apiClient";

export const getDeptTpoDashboard = async () => {
  const response = await apiClient.get("/tpo/dashboard");
  return response;
};
