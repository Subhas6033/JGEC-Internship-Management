import { apiClient } from "../api/apiClient";

/**
 * --------------------------------------------------------------------------
 * Response helper
 * --------------------------------------------------------------------------
 *
 * Supports both:
 *
 * {
 *   success: true,
 *   data: ...
 * }
 *
 * and:
 *
 * {
 *   data: ...
 * }
 *
 * This also works with the centralized apiClient response interceptor.
 */
const getApiData = (response) => {
  if (!response) {
    return null;
  }

  /**
   * API response:
   *
   * {
   *   data: {
   *     success: true,
   *     data: ...
   *   }
   * }
   */
  if (response?.data && response?.data?.success !== undefined) {
    return response.data.data ?? null;
  }

  /**
   * API response:
   *
   * {
   *   success: true,
   *   data: ...
   * }
   */
  if (response?.success !== undefined) {
    return response.data ?? null;
  }

  /**
   * Normal axios response fallback.
   */
  return response?.data ?? response;
};

/**
 * --------------------------------------------------------------------------
 * Get all SPOC applications
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc
 */
const getSpocApplications = ({ search = "", status = "all" } = {}) => {
  return apiClient.get("/applications/spoc", {
    params: {
      search: search.trim() || undefined,
      status: status !== "all" ? status : undefined,
    },
  });
};

/**
 * --------------------------------------------------------------------------
 * Get single SPOC application
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc/:applicationId
 */
const getSpocApplicationById = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/spoc/${applicationId}`);
};

/**
 * --------------------------------------------------------------------------
 * Get applications by organisation
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc/organisation/:organisationId
 */
const getSpocApplicationsByOrganisation = (organisationId) => {
  if (!organisationId) {
    throw new Error("Organisation ID is required");
  }

  return apiClient.get(`/applications/spoc/organisation/${organisationId}`);
};

/**
 * --------------------------------------------------------------------------
 * Accept application
 * --------------------------------------------------------------------------
 *
 * POST /applications/spoc/:applicationId/accept
 *
 * Result:
 *
 * approved_by_tpo
 *      ↓
 * approved_by_spoc
 */
const acceptSpocApplication = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.post(`/applications/spoc/${applicationId}/accept`);
};

/**
 * --------------------------------------------------------------------------
 * Send application back
 * --------------------------------------------------------------------------
 *
 * POST /applications/spoc/:applicationId/send-back
 */
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

/**
 * --------------------------------------------------------------------------
 * Review application
 * --------------------------------------------------------------------------
 *
 * PATCH /applications/spoc/:applicationId/review
 *
 * decision:
 *
 * approve
 * reject
 * send_back
 */
const reviewSpocApplication = (applicationId, payload) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  if (!payload?.decision) {
    throw new Error("Review decision is required");
  }

  return apiClient.patch(`/applications/spoc/${applicationId}/review`, payload);
};

/**
 * --------------------------------------------------------------------------
 * Generate NOC
 * --------------------------------------------------------------------------
 *
 * POST /applications/spoc/:applicationId/noc
 *
 * Only an application with:
 *
 * approved_by_spoc
 *
 * can generate an NOC.
 */
const generateSpocNoc = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.post(`/applications/spoc/${applicationId}/noc`);
};

/**
 * --------------------------------------------------------------------------
 * Get application NOC
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc/:applicationId/noc
 */
const getSpocApplicationNoc = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/spoc/${applicationId}/noc`);
};

/**
 * --------------------------------------------------------------------------
 * Download NOC PDF
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc/:applicationId/noc/pdf
 *
 * Important:
 *
 * responseType must be blob because the backend returns a PDF.
 */
const downloadSpocNocPdf = (applicationId) => {
  if (!applicationId) {
    throw new Error("Application ID is required");
  }

  return apiClient.get(`/applications/spoc/${applicationId}/noc/pdf`, {
    responseType: "blob",
  });
};

/**
 * --------------------------------------------------------------------------
 * Get all SPOC NOCs
 * --------------------------------------------------------------------------
 *
 * GET /applications/spoc/nocs
 */
const getSpocNocs = () => {
  return apiClient.get("/applications/spoc/nocs");
};

/**
 * --------------------------------------------------------------------------
 * Download blob helper
 * --------------------------------------------------------------------------
 */
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
  getSpocApplicationNoc,
  downloadSpocNocPdf,
  getSpocNocs,
  downloadBlob,
};
