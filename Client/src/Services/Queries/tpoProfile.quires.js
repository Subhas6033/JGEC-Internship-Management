import { useMutation } from "@tanstack/react-query";
// Use the same axios instance that tpoApplication.quires.js uses.
import { apiClient as api } from "../api/apiClient";

// Update endpoints (to be added on the backend).
const PROFILE_URL = "/update/profile";

// Handles { data: { user } }, { data: {...} } and a bare object.
const unwrapUser = (response) => {
  const payload = response?.data?.data ?? response?.data ?? null;
  return payload?.user ?? payload;
};

// payload: { fullName, email, mobileNumber }
export const useUpdateTpoProfile = () =>
  useMutation({
    mutationFn: async (payload) =>
      unwrapUser(await api.patch(PROFILE_URL, payload)),
  });

// file: a File object, sent as multipart/form-data under "signature",
// the same field name the student registration route uses.
export const useUpdateTpoSignature = () =>
  useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("signature", file);

      return unwrapUser(
        await api.patch(`${PROFILE_URL}/signature`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      );
    },
  });
