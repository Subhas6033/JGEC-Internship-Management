import { apiClient } from "../api/apiClient";

const TPO_AUTH_BASE = "/auth/tpo";

const registerTPO = async (tpoData) => {
  const response = await apiClient.post(`${TPO_AUTH_BASE}/register`, tpoData, {
    skipAuthRefresh: true,
  });

  return response.data?.data ?? response.data;
};

const loginTPO = async ({ email, password }) => {
  const response = await apiClient.post(
    `${TPO_AUTH_BASE}/login`,
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

const verifyTPOOTP = async ({ challengeId, otp }) => {
  const response = await apiClient.post(
    `${TPO_AUTH_BASE}/otp/verify`,
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

const resendTPOOTP = async ({ challengeId }) => {
  const response = await apiClient.post(
    `${TPO_AUTH_BASE}/otp/resend`,
    {
      challengeId,
    },
    {
      skipAuthRefresh: true,
    },
  );

  return response.data?.data ?? response.data;
};

export { registerTPO, loginTPO, verifyTPOOTP, resendTPOOTP };
