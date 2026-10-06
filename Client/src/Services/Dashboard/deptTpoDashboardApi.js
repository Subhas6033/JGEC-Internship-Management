import { apiClient } from "../api/apiClient";

const getDeptTpoDashboard = async () => {
  const response = await apiClient.get("/tpo/dashboard");
  return response;
};

export { getDeptTpoDashboard };
