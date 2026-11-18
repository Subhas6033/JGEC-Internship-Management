import { apiClient } from "../api/apiClient";
const BASE_URL = "/admin/department-management";

export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

// Works whether apiClient returns the raw axios response or an interceptor
// has already unwrapped it to response.data.
const getBody = (res) =>
  res && typeof res === "object" && "status" in res && "headers" in res
    ? res.data
    : res;

export const getAdminDepartments = async () => {
  const body = getBody(await apiClient.get(BASE_URL));
  const result = body?.data ?? body;

  if (!Array.isArray(result?.departments)) {
    console.error("Unexpected departments API response:", body);
    throw new Error("Invalid departments API response");
  }

  return {
    departments: result.departments,
    stats: result.stats ?? {
      totalDepartments: result.departments.length,
      totalStudents: 0,
      departmentsWithTpo: 0,
      departmentsWithSpoc: 0,
    },
  };
};
