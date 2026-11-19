import { useMutation } from "@tanstack/react-query";
import { apiClient as api } from "../api/apiClient";

const PROFILE_URL = "/update/profile";

// Handles { data: { user } }, { data: {...} } and a bare object.
const unwrapUser = (response) => {
  const payload = response?.data?.data ?? response?.data ?? null;
  return payload?.user ?? payload;
};

// payload: { fullName, email, mobileNumber }
const useUpdateTpoProfile = () =>
  useMutation({
    mutationFn: async (payload) =>
      unwrapUser(await api.patch(PROFILE_URL, payload)),
  });

// file: a File object, sent as multipart/form-data under "signature",
// the same field name the student registration route uses.
const useUpdateTpoSignature = () =>
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

export { useUpdateTpoProfile, useUpdateTpoSignature };
