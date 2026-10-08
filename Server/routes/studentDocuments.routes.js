import { Router } from "express";

import {
  getMyDocuments,
  updateStudentSignature,
  updateStudentResume,
  getMyNOC,
} from "../services/students/studentDocuments.service.js";

import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { documentUpload } from "../middlewares/documentUpload.middleware.js";

const studentDocumentRoutes = Router();

/**
 * ==========================================================================
 * AUTHENTICATION
 * ==========================================================================
 *
 * All student document routes require an authenticated user.
 */
studentDocumentRoutes.use(authenticateUser);

/**
 * ==========================================================================
 * GET MY DOCUMENTS
 * ==========================================================================
 *
 * GET /
 *
 * Returns:
 * - Resume
 * - Signature
 * - Accepted internship application
 * - Existing NOC
 *
 * NOC is NOT generated automatically.
 */
studentDocumentRoutes.get("/", requireRole("student"), getMyDocuments);

/**
 * ==========================================================================
 * UPDATE STUDENT SIGNATURE
 * ==========================================================================
 *
 * PUT /signature
 *
 * Multipart field:
 * signature
 */
studentDocumentRoutes.put(
  "/signature",
  requireRole("student"),
  documentUpload.single("signature"),
  updateStudentSignature,
);

/**
 * ==========================================================================
 * UPDATE STUDENT RESUME
 * ==========================================================================
 *
 * PUT /resume
 *
 * Multipart field:
 * resume
 */
studentDocumentRoutes.put(
  "/resume",
  requireRole("student"),
  documentUpload.single("resume"),
  updateStudentResume,
);

/**
 * ==========================================================================
 * GET MY NOC
 * ==========================================================================
 *
 * GET /noc
 *
 * The student can only retrieve an already-generated NOC.
 *
 * NOC generation is handled by the SPOC:
 *
 * approved_by_spoc
 *        ↓
 * SPOC generates NOC
 *        ↓
 * noc_generated
 */
studentDocumentRoutes.get("/noc", requireRole("student"), getMyNOC);

export { studentDocumentRoutes };
