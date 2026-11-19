import { apiClient } from "../api/apiClient";

const SPOC_PROFILE_ENDPOINT = "/spoc/profile";

// apiClient already unwraps the HTTP body, so `response.data` is the payload.

export const getSpocProfile = async () => {
  const response = await apiClient.get(SPOC_PROFILE_ENDPOINT);
  return response?.data;
};

export const updateSpocProfile = async ({ fullName, mobile }) => {
  const response = await apiClient.patch(SPOC_PROFILE_ENDPOINT, {
    fullName,
    mobile,
  });
  return response?.data;
};

export const changeSpocPassword = async ({ currentPassword, newPassword }) => {
  const response = await apiClient.patch(`${SPOC_PROFILE_ENDPOINT}/password`, {
    currentPassword,
    newPassword,
  });
  return response?.data;
};

export const updateSpocSignature = async (file) => {
  const formData = new FormData();
  formData.append("signature", file);

  const response = await apiClient.put(
    `${SPOC_PROFILE_ENDPOINT}/signature`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return response?.data;
};
