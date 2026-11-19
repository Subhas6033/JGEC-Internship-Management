import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  loginStudent,
  registerStudent,
  verifyStudentOTP,
  resendStudentOTP,
} from "../../Services/Auth/studentAuth.api";
import { setAuth } from "../../Store/Slice/authSlice";

const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "me"],
};

// Student registration.
const useRegisterStudent = () => {
  return useMutation({
    mutationFn: registerStudent,
  });
};

// Student password login.
// Returns the OTP challenge only.
const useLoginStudent = () => {
  return useMutation({
    mutationFn: loginStudent,
  });
};

// Verify Student OTP and authenticate.
const useVerifyStudentOTP = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyStudentOTP,

    onSuccess: (data) => {
      const student = data?.student;
      const accessToken = data?.accessToken;

      if (!student?._id || !accessToken) {
        throw new Error("Invalid Student OTP verification response");
      }

      dispatch(
        setAuth({
          user: student,
          accessToken,
        }),
      );

      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, student);
    },
  });
};

// Resend Student OTP.
const useResendStudentOTP = () => {
  return useMutation({
    mutationFn: resendStudentOTP,
  });
};

export {
  useRegisterStudent,
  useLoginStudent,
  useVerifyStudentOTP,
  useResendStudentOTP,
};
