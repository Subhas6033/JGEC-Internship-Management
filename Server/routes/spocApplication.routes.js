import { Router } from "express";

import {
  getTpoApplicationsController,
  getSpocApplicationsController,
  getApplicationController,
  getSpocApplicationsByOrganisationController,
  tpoReviewController,
  spocReviewController,
  resubmitApplicationController,
  generateNocController,
  getApplicationReviewsController,
  getApplicationNocController,
  downloadNocPdfController,
  getSpocNocsController,
} from "../services/spoc/application.controller.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const spocApplicationRoutes = Router();

/**
 * --------------------------------------------------------------------------
 * Authentication
 * --------------------------------------------------------------------------
 *
 * All application routes require authentication.
 */
spocApplicationRoutes.use(authenticateUser);

/**
 * --------------------------------------------------------------------------
 * TPO
 * --------------------------------------------------------------------------
 */

/**
 * GET /applications/tpo
 *
 * Get applications available for TPO review.
 */
spocApplicationRoutes.get(
  "/tpo",
  requireRole("tpo"),
  getTpoApplicationsController,
);

/**
 * PATCH /applications/:applicationId/tpo-review
 *
 * TPO review:
 * - approve
 * - reject
 * - send_back
 */
spocApplicationRoutes.patch(
  "/:applicationId/tpo-review",
  requireRole("tpo"),
  tpoReviewController,
);

/**
 * --------------------------------------------------------------------------
 * SPOC
 * --------------------------------------------------------------------------
 */

/**
 * GET /applications/spoc
 *
 * Get all applications visible to SPOC.
 */
spocApplicationRoutes.get(
  "/spoc",
  requireRole("spoc"),
  getSpocApplicationsController,
);

/**
 * IMPORTANT:
 *
 * Static/specific routes must come before:
 *
 * /spoc/:applicationId
 */

/**
 * GET /applications/spoc/nocs
 *
 * Get all generated NOCs.
 */
spocApplicationRoutes.get(
  "/spoc/nocs",
  requireRole("spoc"),
  getSpocNocsController,
);

/**
 * GET /applications/spoc/organisation/:organisationId
 *
 * Get all applications belonging to an organisation.
 */
spocApplicationRoutes.get(
  "/spoc/organisation/:organisationId",
  requireRole("spoc"),
  getSpocApplicationsByOrganisationController,
);

/**
 * GET /applications/spoc/:applicationId
 *
 * Get a single application.
 */
spocApplicationRoutes.get(
  "/spoc/:applicationId",
  requireRole("spoc"),
  getApplicationController,
);

/**
 * PATCH /applications/spoc/:applicationId/review
 *
 * SPOC review:
 * - approve
 * - reject
 * - send_back
 */
spocApplicationRoutes.patch(
  "/spoc/:applicationId/review",
  requireRole("spoc"),
  spocReviewController,
);

/**
 * POST /applications/spoc/:applicationId/accept
 *
 * Shortcut endpoint for accepting an application.
 */
spocApplicationRoutes.post(
  "/spoc/:applicationId/accept",
  requireRole("spoc"),
  async (req, res, next) => {
    req.body = {
      ...(req.body || {}),
      decision: "approve",
    };

    return spocReviewController(req, res, next);
  },
);

/**
 * POST /applications/spoc/:applicationId/send-back
 *
 * Shortcut endpoint for sending an application back.
 */
spocApplicationRoutes.post(
  "/spoc/:applicationId/send-back",
  requireRole("spoc"),
  async (req, res, next) => {
    req.body = {
      ...(req.body || {}),
      decision: "send_back",
      reason: req.body?.reason,
    };

    return spocReviewController(req, res, next);
  },
);

/**
 * --------------------------------------------------------------------------
 * Student
 * --------------------------------------------------------------------------
 */

/**
 * PATCH /applications/:applicationId/resubmit
 *
 * Student resubmits an application after send-back.
 */
spocApplicationRoutes.patch(
  "/:applicationId/resubmit",
  requireRole("student"),
  resubmitApplicationController,
);

/**
 * --------------------------------------------------------------------------
 * NOC
 * --------------------------------------------------------------------------
 */

/**
 * POST /applications/spoc/:applicationId/noc
 *
 * Generate NOC for an application.
 *
 * Allowed only after:
 *
 * approved_by_spoc
 */
spocApplicationRoutes.post(
  "/spoc/:applicationId/noc",
  requireRole("spoc"),
  generateNocController,
);

/**
 * GET /applications/spoc/:applicationId/reviews
 *
 * Get application review history.
 */
spocApplicationRoutes.get(
  "/spoc/:applicationId/reviews",
  requireRole("spoc"),
  getApplicationReviewsController,
);

/**
 * GET /applications/spoc/:applicationId/noc
 *
 * Get generated NOC information.
 */
spocApplicationRoutes.get(
  "/spoc/:applicationId/noc",
  requireRole("spoc"),
  getApplicationNocController,
);

/**
 * GET /applications/spoc/:applicationId/noc/pdf
 *
 * Download generated NOC as PDF.
 */
spocApplicationRoutes.get(
  "/spoc/:applicationId/noc/pdf",
  requireRole("spoc"),
  downloadNocPdfController,
);

export { spocApplicationRoutes };
