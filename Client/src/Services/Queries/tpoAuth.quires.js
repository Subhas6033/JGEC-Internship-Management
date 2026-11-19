import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  registerTPO,
  loginTPO,
  verifyTPOOTP,
  resendTPOOTP,
} from "../Auth/tpoAuthApi";
import { setAuth } from "../../Store/Slice/authSlice";

const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "me"],
};

// TPO registration.
const useRegisterTPO = () => {
  return useMutation({
    mutationFn: registerTPO,
  });
};

// TPO password login.
// Returns the OTP challenge only.
const useLoginTPO = () => {
  return useMutation({
    mutationFn: loginTPO,
  });
};

// Verify TPO OTP and authenticate.
const useVerifyTPOOTP = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyTPOOTP,

    onSuccess: (data) => {
      const tpo = data?.tpo;
      const accessToken = data?.accessToken;

      if (!tpo?._id || !accessToken) {
        throw new Error("Invalid TPO OTP verification response");
      }

      dispatch(
        setAuth({
          user: tpo,
          accessToken,
        }),
      );

      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, tpo);
    },
  });
};

// Resend TPO OTP.
const useResendTPOOTP = () => {
  return useMutation({
    mutationFn: resendTPOOTP,
  });
};

export { useRegisterTPO, useLoginTPO, useVerifyTPOOTP, useResendTPOOTP };
