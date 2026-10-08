import {
  getTpoApplications,
  getSpocApplications,
  getApplication,
  getSpocApplicationsByOrganisation,
  reviewByTpo,
  reviewBySpoc,
  resubmitApplication,
  generateNoc,
  regenerateNoc,
  getApplicationReviews,
  getNocByApplication,
  getSpocNocs,
} from "./application.service.js";

import { asyncHandler, APIRES, APIERR } from "../../utils/helper.utils.js";

import { HTTP_STATUS } from "../../config/httpConfig.config.js";

import fs from "node:fs/promises";
import path from "node:path";

/* -------------------------------------------------------------------------- */
/* TPO APPLICATIONS                                                           */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* SPOC APPLICATIONS                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* SPOC APPLICATIONS BY ORGANISATION                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* APPLICATION BY ID                                                          */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* TPO REVIEW                                                                 */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* SPOC REVIEW                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* RESUBMIT APPLICATION                                                       */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* GENERATE NOC                                                               */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* REGENERATE NOC                                                             */
/* -------------------------------------------------------------------------- */

/**
 * POST
 * /applications/spoc/:applicationId/noc/regenerate
 *
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

/* -------------------------------------------------------------------------- */
/* APPLICATION REVIEWS                                                        */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* APPLICATION NOC                                                            */
/* -------------------------------------------------------------------------- */

export const getApplicationNocController = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;

  const noc = await getNocByApplication(applicationId);

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, noc, "NOC fetched successfully"));
});

/* -------------------------------------------------------------------------- */
/* DOWNLOAD / OPEN NOC PDF                                                    */
/* -------------------------------------------------------------------------- */

/**
 * GET
 * /applications/spoc/:applicationId/noc/pdf
 *
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

  /* ------------------------------------------------------------
       Get NOC
    ------------------------------------------------------------ */

  const noc = await getNocByApplication(applicationId);

  if (!noc) {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC not found for this application",
    );
  }

  /* ------------------------------------------------------------
       Check file path
    ------------------------------------------------------------ */

  if (!noc.filePath) {
    throw new APIERR(HTTP_STATUS.NOT_FOUND, "NOC PDF file path not found");
  }

  /* ------------------------------------------------------------
       Convert relative path to absolute path
    ------------------------------------------------------------ */

  const absoluteFilePath = path.isAbsolute(noc.filePath)
    ? noc.filePath
    : path.join(process.cwd(), noc.filePath);

  /* ------------------------------------------------------------
       Check that file exists
    ------------------------------------------------------------ */

  try {
    await fs.access(absoluteFilePath);
  } catch {
    throw new APIERR(
      HTTP_STATUS.NOT_FOUND,
      "NOC PDF file does not exist on the server",
    );
  }

  /* ------------------------------------------------------------
       Set headers
    ------------------------------------------------------------ */

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader("Content-Disposition", `inline; filename="${noc.fileName}"`);

  /*
   * No Content-Length from the DB: after a regenerate the stored value
   * could differ from the file on disk. sendFile sets the correct
   * length itself.
   */

  /* ------------------------------------------------------------
       Send PDF
    ------------------------------------------------------------ */

  return res.sendFile(absoluteFilePath);
});

/* -------------------------------------------------------------------------- */
/* ALL SPOC NOCS                                                              */
/* -------------------------------------------------------------------------- */

export const getSpocNocsController = asyncHandler(async (req, res) => {
  const nocs = await getSpocNocs();

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, nocs, "SPOC NOCs fetched successfully"));
});
