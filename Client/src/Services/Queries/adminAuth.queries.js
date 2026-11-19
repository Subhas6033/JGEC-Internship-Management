import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  registerAdmin,
  loginAdmin,
  verifyAdminOTP,
  resendAdminOTP,
  getCurrentUser,
  logoutUser,
} from "../Auth/adminAuth.api";
import { setAuth, clearUser } from "../../Store/Slice/authSlice";

const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "me"],
};

// Admin registration.
const useAdminRegistration = () => {
  return useMutation({
    mutationFn: registerAdmin,
  });
};

// Admin password login.
// This only sends the OTP; it does not authenticate the user yet.
const useAdminLogin = () => {
  return useMutation({
    mutationFn: loginAdmin,
  });
};

// Verify Admin OTP and establish Redux authentication.
const useVerifyAdminOTP = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyAdminOTP,

    onSuccess: (data) => {
      const admin = data?.admin;
      const accessToken = data?.accessToken;

      if (!admin?._id || !accessToken) {
        throw new Error("Invalid Admin OTP verification response");
      }

      dispatch(
        setAuth({
          user: admin,
          accessToken,
        }),
      );

      queryClient.setQueryData(AUTH_QUERY_KEYS.currentUser, admin);
    },
  });
};

// Resend Admin OTP.
const useResendAdminOTP = () => {
  return useMutation({
    mutationFn: resendAdminOTP,
  });
};

// Shared current-user query.
const useCurrentUser = (enabled = true) => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.currentUser,
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// Shared logout mutation.
const useAuthLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,

    onSettled: () => {
      dispatch(clearUser());

      queryClient.removeQueries({
        queryKey: AUTH_QUERY_KEYS.currentUser,
      });
    },
  });
};

export {
  useAdminRegistration,
  useAdminLogin,
  useVerifyAdminOTP,
  useResendAdminOTP,
  useCurrentUser,
  useAuthLogout,
};
