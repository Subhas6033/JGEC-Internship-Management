import { apiClient } from "../api/apiClient";

const forgotPassword = async ({ email, role }) => {
  const response = await apiClient.post("/auth/forgot-password", {
    email,
    role,
  });

  return response.data;
};

// Verify whether the reset token is valid
const verifyResetPasswordToken = async (token) => {
  const response = await apiClient.post("/auth/verify-reset-token", {
    token,
  });

  return response.data;
};

// Update the user's password
const resetPassword = async ({ token, newPassword }) => {
  const response = await apiClient.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return response.data;
};

export { forgotPassword, verifyResetPasswordToken, resetPassword };
