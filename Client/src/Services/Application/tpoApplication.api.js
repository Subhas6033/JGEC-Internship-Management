import { apiClient } from "../api/apiClient";

const getApiData = (response) => {
  if (!response) {
    return null;
  }

  // Axios response containing API response
  if (response?.data && response?.data?.success !== undefined) {
    return response.data?.data ?? null;
  }

  // Already unwrapped API response
  if (response?.success !== undefined) {
    return response?.data ?? null;
  }

  // Axios response where data itself is the actual payload
  return response?.data ?? response;
};

// Get all the applications
const getTpoApplications = ({ search = "", status = "all" } = {}) => {
  return apiClient.get("/applications/tpo", {
    params: {
      search: search.trim() || undefined,
      status: status !== "all" ? status : undefined,
    },
  });
};

// Get applications by ID
const getTpoApplicationById = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/tpo/${applicationId}`);
};

// Get applications by the organisations
const getTpoApplicationsByOrganisation = (organisationId) => {
  if (!organisationId) {
    throw new Error("Organisation ID is required");
  }

  return apiClient.get(`/applications/tpo/organisation/${organisationId}`);
};

// Accept the applications
const acceptTpoApplication = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.post(`/applications/tpo/${applicationId}/accept`);
};

// Send back the appliactions
const sendBackTpoApplication = (applicationId, reason) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  if (!reason || !reason.trim()) {
    throw new Error("Send-back reason is required");
  }

  return apiClient.post(`/applications/tpo/${applicationId}/send-back`, {
    reason: reason.trim(),
  });
};

export {
  getApiData,
  getTpoApplications,
  getTpoApplicationById,
  getTpoApplicationsByOrganisation,
  acceptTpoApplication,
  sendBackTpoApplication,
};
