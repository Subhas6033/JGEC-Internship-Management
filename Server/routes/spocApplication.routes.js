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
  generateBulkNocController,
  regenerateNocController,
  getApplicationReviewsController,
  getApplicationNocController,
  downloadNocPdfController,
  getSpocNocsController,
} from "../services/spoc/application.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const spocApplicationRoutes = Router();

spocApplicationRoutes.use(authenticateUser);
spocApplicationRoutes.get(
  "/tpo",
  requireRole("tpo"),
  getTpoApplicationsController,
);
spocApplicationRoutes.patch(
  "/:applicationId/tpo-review",
  requireRole("tpo"),
  tpoReviewController,
);
spocApplicationRoutes.get(
  "/spoc",
  requireRole("spoc"),
  getSpocApplicationsController,
);
spocApplicationRoutes.get(
  "/spoc/nocs",
  requireRole("spoc"),
  getSpocNocsController,
);
spocApplicationRoutes.post(
  "/spoc/noc/bulk",
  requireRole("spoc"),
  generateBulkNocController,
);
spocApplicationRoutes.get(
  "/spoc/organisation/:organisationId",
  requireRole("spoc"),
  getSpocApplicationsByOrganisationController,
);
spocApplicationRoutes.get(
  "/spoc/:applicationId",
  requireRole("spoc"),
  getApplicationController,
);
spocApplicationRoutes.patch(
  "/spoc/:applicationId/review",
  requireRole("spoc"),
  spocReviewController,
);
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
spocApplicationRoutes.patch(
  "/:applicationId/resubmit",
  requireRole("student"),
  resubmitApplicationController,
);
spocApplicationRoutes.post(
  "/spoc/:applicationId/noc",
  requireRole("spoc"),
  generateNocController,
);
spocApplicationRoutes.post(
  "/spoc/:applicationId/noc/regenerate",
  requireRole("spoc"),
  regenerateNocController,
);
spocApplicationRoutes.get(
  "/spoc/:applicationId/reviews",
  requireRole("spoc"),
  getApplicationReviewsController,
);
spocApplicationRoutes.get(
  "/spoc/:applicationId/noc",
  requireRole("spoc"),
  getApplicationNocController,
);
spocApplicationRoutes.get(
  "/spoc/:applicationId/noc/pdf",
  requireRole("spoc"),
  downloadNocPdfController,
);

export { spocApplicationRoutes };
