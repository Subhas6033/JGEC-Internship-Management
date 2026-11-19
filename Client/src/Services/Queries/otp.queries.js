import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/apiClient";

// Verify SPOC OTP.
const verifyOTP = async ({ challengeId, otp }) => {
  const response = await apiClient.post("/auth/spoc/otp/verify", {
    challengeId,
    otp,
  });

  return response.data;
};

// Resend SPOC OTP.
const resendOTP = async ({ challengeId }) => {
  const response = await apiClient.post("/auth/spoc/otp/resend", {
    challengeId,
  });

  return response.data;
};

// Verify OTP mutation.
const useVerifyOTP = () => {
  return useMutation({
    mutationFn: verifyOTP,
  });
};

// Resend OTP mutation.
const useResendOTP = () => {
  return useMutation({
    mutationFn: resendOTP,
  });
};

export { useVerifyOTP, useResendOTP };
