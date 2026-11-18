import { apiClient } from "../api/apiClient";
const BASE_URL = "/admin/staff-management";

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

const getAdminStaff = async (params = {}) => {
  const body = getBody(await apiClient.get(BASE_URL, { params }));
  const payload = body?.data;

  const staff = Array.isArray(payload) ? payload : payload?.staff;
  const pagination = Array.isArray(payload)
    ? body?.pagination
    : payload?.pagination;

  if (!Array.isArray(staff)) {
    console.error("Unexpected staff API response:", body);
    throw new Error("Invalid staff API response");
  }

  return {
    staff,
    pagination: pagination ?? {
      page: Number(params.page) || 1,
      limit: Number(params.limit) || 10,
      total: staff.length,
      totalPages: 1,
    },
  };
};

const getAdminStaffStats = async () => {
  const body = getBody(await apiClient.get(`${BASE_URL}/stats`));
  const stats = body?.data ?? body;

  if (typeof stats?.totalStaff !== "number") {
    console.error("Unexpected staff stats response:", body);
    throw new Error("Invalid staff stats response");
  }

  return stats;
};

const updateAdminStaff = async ({ staffId, payload }) => {
  const body = getBody(await apiClient.put(`${BASE_URL}/${staffId}`, payload));
  return body?.data?.staff ?? body?.data;
};

const toggleAdminStaffStatus = async (staffId) => {
  const body = getBody(await apiClient.patch(`${BASE_URL}/${staffId}/status`));
  return body?.data?.staff ?? body?.data;
};

export {
  getAdminStaff,
  getAdminStaffStats,
  updateAdminStaff,
  toggleAdminStaffStatus,
};
