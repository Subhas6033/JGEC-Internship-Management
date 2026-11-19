import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "../api/apiClient";

const PROFILE_URL = "/update/profile";
const ME_URL = "/auth/me";

const ADMIN_PROFILE_KEY = ["admin", "profile"];

const unwrap = (response) => {
  const payload = response?.data?.data ?? response?.data ?? null;
  return payload?.user ?? payload;
};

// Maps the backend document to the shape the settings UI uses.
const normalizeAdmin = (user) => ({
  name: user?.fullName ?? "",
  email: user?.email ?? "",
  phone: user?.mobile ?? user?.mobileNumber ?? "",
  signature: user?.signature ?? "",
});

const useAdminProfile = () =>
  useQuery({
    queryKey: ADMIN_PROFILE_KEY,
    queryFn: async () => normalizeAdmin(unwrap(await api.get(ME_URL))),
  });

const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) =>
      unwrap(await api.patch(PROFILE_URL, { role: "ADMIN", ...payload })),
    onSuccess: (user) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEY, (old) => ({
        ...old,
        ...normalizeAdmin(user),
        // keep fields the update endpoint doesn't return
        signature: user?.signature ?? old?.signature ?? "",
      }));
    },
  });
};

const useUpdateAdminSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("signature", file);

      return unwrap(
        await api.patch(`${PROFILE_URL}/signature`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ADMIN_PROFILE_KEY, (old) => ({
        ...old,
        signature: data?.signature?.url ?? old?.signature ?? "",
      }));
    },
  });
};

export {
  normalizeAdmin,
  useAdminProfile,
  useUpdateAdminProfile,
  useUpdateAdminSignature,
};
