import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  registerSpoc,
  loginSpoc,
  getCurrentSpoc,
  logoutSpoc,
} from "../Auth/spocAuth.api";
import { clearUser } from "../../Store/Slice/authSlice";

const SPOC_AUTH_KEYS = {
  currentUser: ["auth", "me"],
};

// Extract APIRES data.
const getResponseData = (response) => {
  return response?.data ?? response;
};

// SPOC registration.
const useSpocRegistration = () => {
  return useMutation({
    mutationFn: registerSpoc,
  });
};

// SPOC login: password validation and OTP initiation.
const useSpocLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const response = await loginSpoc(credentials);

      const data = getResponseData(response);
      const otp = data?.otp;

      if (!otp?.challengeId) {
        throw new Error("Invalid SPOC login response: OTP challenge missing.");
      }

      return otp;
    },
  });
};

// Get current SPOC.
const useCurrentSpoc = (enabled = true) => {
  return useQuery({
    queryKey: SPOC_AUTH_KEYS.currentUser,
    queryFn: getCurrentSpoc,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// SPOC logout.
const useSpocLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutSpoc,

    onSuccess: () => {
      dispatch(clearUser());

      queryClient.removeQueries({
        queryKey: SPOC_AUTH_KEYS.currentUser,
      });
    },
  });
};

export { useSpocRegistration, useSpocLogin, useSpocLogout, useCurrentSpoc };
