import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";

import {
  registerAdmin,
  loginAdmin,
  getCurrentUser,
  logoutUser,
} from "../Auth/adminAuth.api";

import { setAuth, clearUser } from "../../Store/Slice/authSlice";

export const AUTH_QUERY_KEYS = {
  currentUser: ["auth", "me"],
};

// Admin registration: account creation only.
// The existing UI redirects to the login page after success.
const useAdminRegistration = () => {
  return useMutation({
    mutationFn: registerAdmin,
  });
};

// Admin login: one shared Redux authentication state.
const useAdminLogin = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAdmin,

    onSuccess: (data) => {
      const admin = data?.admin;
      const accessToken = data?.accessToken;

      if (!admin?._id || !accessToken) {
        throw new Error("Invalid Admin login response");
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

// One centralized current-user query.
// Use this for any authenticated role, not a separate /admin/me.
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

export { useAdminRegistration, useAdminLogin, useCurrentUser, useAuthLogout };
