import { apiClient } from "../api/apiClient";

const BASE_URL = "/admin/analytics";

const getBody = (res) =>
  res && typeof res === "object" && "status" in res && "headers" in res
    ? res.data
    : res;

export const getAdminAnalytics = async (period = "12m") => {
  const body = getBody(
    await apiClient.get(BASE_URL, { params: { period } }),
  );
  const result = body?.data ?? body;

  if (!result || !result.summary) {
    console.error("Unexpected analytics API response:", body);
    throw new Error("Invalid analytics API response");
  }

  return result;
};