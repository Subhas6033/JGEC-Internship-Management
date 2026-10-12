import { apiClient } from "../api/apiClient";

// Helper Functions
const getApiData = (response) => {
  if (!response) {
    return null;
  }

  if (response?.data && response?.data?.success !== undefined) {
    return response.data.data ?? null;
  }

  if (response?.success !== undefined) {
    return response.data ?? null;
  }
  // Normal axios response fallback
  return response?.data ?? response;
};

// Get the all SPOC Applications
const getSpocApplications = ({ search = "", status = "all" } = {}) => {
  return apiClient.get("/applications/spoc", {
    params: {
      search: search.trim() || undefined,
      status: status !== "all" ? status : undefined,
    },
  });
};

// Get the Single SPOC Applications
const getSpocApplicationById = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }
  return apiClient.get(`/applications/spoc/${applicationId}`);
};

// Get the Applications by Organisations
const getSpocApplicationsByOrganisation = (organisationId) => {
  if (!organisationId) {
    throw new Error("Organisation ID is required");
  }
  return apiClient.get(`/applications/spoc/organisation/${organisationId}`);
};

// Accept the Applications
const acceptSpocApplication = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }
  return apiClient.post(`/applications/spoc/${applicationId}/accept`);
};

// Send the Applications Back to the Students
const sendBackSpocApplication = (applicationId, reason) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  if (!reason || !reason.trim()) {
    throw new Error("Send-back reason is required");
  }

  return apiClient.post(`/applications/spoc/${applicationId}/send-back`, {
    reason: reason.trim(),
  });
};

// Review Applications
const reviewSpocApplication = (applicationId, payload) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  if (!payload?.decision) {
    throw new Error("Review decision is required");
  }

  return apiClient.patch(`/applications/spoc/${applicationId}/review`, payload);
};

// Generate the NOCs
const generateSpocNoc = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.post(`/applications/spoc/${applicationId}/noc`);
};

/**
 * Generate the BULK NOCs
 * The backend groups the applications by organisation + department and
 * generates one NOC (own reference number, one PDF) per group.
 */
const generateBulkSpocNoc = (applicationIds) => {
  if (!Array.isArray(applicationIds) || applicationIds.length === 0) {
    throw new Error("Select at least one application");
  }

  return apiClient.post("/applications/spoc/noc/bulk", {
    applicationIds,
  });
};

// Get the NOC
const getSpocApplicationNoc = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/spoc/${applicationId}/noc`);
};

// Download the NOCs
const downloadSpocNocPdf = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/spoc/${applicationId}/noc/pdf`, {
    responseType: "blob",
  });
};

// Get all the SPOC NOCs
const getSpocNocs = () => {
  return apiClient.get("/applications/spoc/nocs");
};

// NOC Download Blob Helpers
const downloadBlob = (blob, filename = "NOC.pdf") => {
  if (!blob) {
    throw new Error("PDF file is not available");
  }

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
};

export {
  getApiData,
  getSpocApplications,
  getSpocApplicationById,
  getSpocApplicationsByOrganisation,
  acceptSpocApplication,
  sendBackSpocApplication,
  reviewSpocApplication,
  generateSpocNoc,
  generateBulkSpocNoc,
  getSpocApplicationNoc,
  downloadSpocNocPdf,
  getSpocNocs,
  downloadBlob,
};
