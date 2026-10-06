import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  registerSpoc,
  loginSpoc,
  getCurrentSpoc,
  logoutSpoc,
} from "../Auth/spocAuth.api";
import { setAuth, clearUser } from "../../Store/Slice/authSlice";
const SPOC_AUTH_KEYS = {
  currentUser: ["auth", "me"],
};

// SPOC register
const useSpocRegistration = () => {
  return useMutation({
    mutationFn: registerSpoc,
  });
};

// SPOC login
const useSpocLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await loginSpoc(credentials);
      const spoc = response?.spoc;
      const accessToken = response?.accessToken;
      if (!spoc?._id || !accessToken) {
        throw new Error("Invalid SPOC login response");
      }
      dispatch(
        setAuth({
          user: spoc,
          accessToken,
        }),
      );
      queryClient.setQueryData(SPOC_AUTH_KEYS.currentUser, spoc);
      return response;
    },
  });
};

// Get current SPOC
const useCurrentSpoc = (enabled = true) => {
  return useQuery({
    queryKey: SPOC_AUTH_KEYS.currentUser,
    queryFn: getCurrentSpoc,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

// SPOC logout
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
