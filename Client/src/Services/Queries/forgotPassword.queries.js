import { useMutation, useQuery } from "@tanstack/react-query";
import {
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
} from "../Auth/forgotPassword.api";

const useForgotPasswordMutation = () => {
  return useMutation({
    mutationKey: ["auth", "forgot-password"],
    mutationFn: forgotPassword,
  });
};

// Verify token when the reset page opens
const useVerifyResetPasswordTokenQuery = (token) => {
  return useQuery({
    queryKey: ["auth", "verify-reset-token", token],
    queryFn: () => verifyResetPasswordToken(token),
    enabled: Boolean(token),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

// Submit new password
const useResetPasswordMutation = () => {
  return useMutation({
    mutationKey: ["auth", "reset-password"],
    mutationFn: resetPassword,
  });
};

export {
  useForgotPasswordMutation,
  useVerifyResetPasswordTokenQuery,
  useResetPasswordMutation,
};
