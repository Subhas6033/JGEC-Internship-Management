import { Router } from "express";
import {
  getPendingNOCs,
  getNOCDetails,
  approveAndSendNOC,
  bulkApproveAndSendNOCs,
  getNOCStats,
} from "../services/admin/admin.noc.controller.js";
import { getNOCDocumentController } from "../services/admin/AdminNOC.documnet.service.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const adminNocRoutes = Router();

// All routes require authentication and admin role
adminNocRoutes.use(authenticateUser, requireRole("admin"));

// Get pending NOCs list
adminNocRoutes.get("/pending", getPendingNOCs);

// Get NOC statistics
adminNocRoutes.get("/stats", getNOCStats);

// Get single NOC details
adminNocRoutes.get("/:applicationId", getNOCDetails);

// Approve and send single NOC
adminNocRoutes.post("/:applicationId/approve", approveAndSendNOC);

// Bulk approve and send NOCs
adminNocRoutes.post("/bulk-approve", bulkApproveAndSendNOCs);
adminNocRoutes.get("/:applicationId/document", getNOCDocumentController);

export { adminNocRoutes };
