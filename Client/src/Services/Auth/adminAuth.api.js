import { apiClient } from "../api/apiClient";

const ADMIN_AUTH_BASE = "/auth/admin";

const registerAdmin = async (payload) => {
  const response = await apiClient.post(
    `${ADMIN_AUTH_BASE}/register`,
    payload,
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

const loginAdmin = async ({ email, password }) => {
  const response = await apiClient.post(
    `${ADMIN_AUTH_BASE}/login`,
    {
      email: email.trim().toLowerCase(),
      password,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

const verifyAdminOTP = async ({ challengeId, otp }) => {
  const response = await apiClient.post(
    `${ADMIN_AUTH_BASE}/otp/verify`,
    {
      challengeId,
      otp,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

const resendAdminOTP = async ({ challengeId }) => {
  const response = await apiClient.post(
    `${ADMIN_AUTH_BASE}/otp/resend`,
    {
      challengeId,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

// Shared current-user endpoint.
const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  const data = response.data?.data ?? response.data;

  return (
    data?.user ??
    data?.admin ??
    data?.student ??
    data?.tpo ??
    data?.spoc ??
    null
  );
};

// Shared logout endpoint.
const logoutUser = async () => {
  const response = await apiClient.post(
    "/auth/logout",
    {},
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

export {
  registerAdmin,
  loginAdmin,
  verifyAdminOTP,
  resendAdminOTP,
  getCurrentUser,
  logoutUser,
};
