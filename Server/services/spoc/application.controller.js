import {
  getTpoApplications,
  getSpocApplications,
  getApplication,
  getSpocApplicationsByOrganisation,
  reviewByTpo,
  reviewBySpoc,
  resubmitApplication,
  generateNoc,
  generateBulkNoc,
  regenerateNoc,
  getApplicationReviews,
  getNocByApplication,
  getSpocNocs,
} from "./application.service.js";
import { asyncHandler, APIRES, APIERR } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import fs from "node:fs/promises";
import path from "node:path";

// TPO Applications
export const getTpoApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getTpoApplications();

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        applications,
        "TPO applications fetched successfully",
      ),
    );
});

// SPOC applications
export const getSpocApplicationsController = asyncHandler(async (req, res) => {
  const applications = await getSpocApplications();

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        applications,
        "SPOC applications fetched successfully",
      ),
    );
});

// SPOC applications by the Organisations
export const getSpocApplicationsByOrganisationController = asyncHandler(
  async (req, res) => {
    const { organisationId } = req.params;

    const applications =
      await getSpocApplicationsByOrganisation(organisationId);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new APIRES(
          HTTP_STATUS.OK,
          applications,
          "SPOC applications by organisation fetched successfully",
        ),
      );
  },
);

// Get the Applications by ID
export const getApplicationController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const application = await getApplication(applicationId);

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "Application fetched successfully",
      ),
    );
});

// TPO reviews
export const tpoReviewController = asyncHandler(async (req, res) => {
  const { decision, reason } = req.body;
  const { applicationId } = req.params;
  const reviewerId = req.user?._id || req.user?.id || req.userId;
  const application = await reviewByTpo({
    applicationId,
    reviewerId,
    decision,
    reason,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "TPO decision recorded successfully",
      ),
    );
});

// SPOC reviews
export const spocReviewController = asyncHandler(async (req, res) => {
  const { decision, reason } = req.body;
  const { applicationId } = req.params;
  const reviewerId = req.user?._id || req.user?.id || req.userId;
  const application = await reviewBySpoc({
    applicationId,
    reviewerId,
    decision,
    reason,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "SPOC decision recorded successfully",
      ),
    );
});

// Resubmit the Applications
export const resubmitApplicationController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const studentId = req.user?._id || req.user?.id || req.userId;

  const application = await resubmitApplication({
    applicationId,
    studentId,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        application,
        "Application resubmitted successfully",
      ),
    );
});

// Generate NOC
export const generateNocController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const generatedBy = req.user?._id || req.user?.id || req.userId;

  if (!generatedBy) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(
        new APIRES(
          HTTP_STATUS.UNAUTHORIZED,
          null,
          "Authenticated SPOC user not found",
        ),
      );
  }

  const noc = await generateNoc({
    applicationId,
    generatedBy,
  });

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        noc,
        applicationId,

        /*
         * Backend URL for opening/downloading
         * the generated PDF.
         */
        downloadUrl: `/applications/spoc/${applicationId}/noc/pdf`,
      },
      "NOC generated successfully",
    ),
  );
});

/**
 * Generate NOC in BULK
 * Groups the applications by organisation + department and generates
 * one NOC (own reference number, one PDF) per group.
 */
export const generateBulkNocController = asyncHandler(async (req, res) => {
  const { applicationIds } = req.body;
  const generatedBy = req.user?._id || req.user?.id || req.userId;

  if (!generatedBy) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(
        new APIRES(
          HTTP_STATUS.UNAUTHORIZED,
          null,
          "Authenticated SPOC user not found",
        ),
      );
  }

  const { groups, skipped } = await generateBulkNoc({
    applicationIds,
    generatedBy,
  });

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        groups: groups.map((group) => ({
          referenceNumber: group.referenceNumber,
          department: group.department,
          organisation: group.organisation,
          applicationIds: group.applicationIds,
          downloadUrls: group.applicationIds.map(
            (id) => `/applications/spoc/${id}/noc/pdf`,
          ),
          nocs: group.nocs,
        })),
        skipped,
      },
      "Bulk NOC generated successfully",
    ),
  );
});

/**
 * Regenerate the NOC
 * Rebuilds the PDF of an already generated NOC (same reference number)
 * with the current SPOC / TPO / student data.
 */
export const regenerateNocController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const generatedBy = req.user?._id || req.user?.id || req.userId;

  if (!generatedBy) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json(
        new APIRES(
          HTTP_STATUS.UNAUTHORIZED,
          null,
          "Authenticated SPOC user not found",
        ),
      );
  }

  const noc = await regenerateNoc({
    applicationId,
    generatedBy,
  });

  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        noc,
        applicationId,
        downloadUrl: `/applications/spoc/${applicationId}/noc/pdf`,
      },
      "NOC regenerated successfully",
    ),
  );
});

// Application Reviews
export const getApplicationReviewsController = asyncHandler(
  async (req, res) => {
    const { applicationId } = req.params;
    const reviews = await getApplicationReviews(applicationId);

    return res
      .status(HTTP_STATUS.OK)
      .json(
        new APIRES(
          HTTP_STATUS.OK,
          reviews,
          "Application review history fetched successfully",
        ),
      );
  },
);

// Applications NOC
export const getApplicationNocController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const noc = await getNocByApplication(applicationId);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, noc, "NOC fetched successfully"));
});

/**
 * Download NOC
 * The PDF is already stored on the backend server.
 *
 * MongoDB
 *    ↓
 * NOC.filePath
 *    ↓
 * Server filesystem
 *    ↓
 * res.sendFile()
 */

export const downloadNocPdfController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  // Get NOC
  const noc = await getNocByApplication(applicationId);

  if (!noc) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC not found for this application",
    );
  }
  // Check file path
  if (!noc.filePath) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC PDF file path not found");
  }
  // Convert absolute path to relative path
  const absoluteFilePath = path.isAbsolute(noc.filePath)
    ? noc.filePath
    : path.join(process.cwd(), noc.filePath);

  // Check if file exist or not
  try {
    await fs.access(absoluteFilePath);
  } catch {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC PDF file does not exist on the server",
    );
  }
  // Set Headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${noc.fileName}"`);

  /*
   * No Content-Length from the DB: after a regenerate the stored value
   * could differ from the file on disk. sendFile sets the correct
   * length itself.
   */
  return res.sendFile(absoluteFilePath);
});

// All SPOC NOCs
export const getSpocNocsController = asyncHandler(async (req, res) => {
  const nocs = await getSpocNocs();

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, nocs, "SPOC NOCs fetched successfully"));
});
