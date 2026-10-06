import { Router } from "express";
import {
  getMyDocuments,
  updateStudentSignature,
  updateStudentResume,
  regenerateMyNOC,
} from "../services/students/studentDocuments.service.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { documentUpload } from "../middlewares/documentUpload.middleware.js";

const studentDocumentRoutes = Router();

studentDocumentRoutes.use(authenticateUser);
studentDocumentRoutes
  .get("/", requireRole("student"), getMyDocuments)
  .put(
    "/signature",
    requireRole("student"),
    documentUpload.single("signature"),
    updateStudentSignature,
  )
  .put(
    "/resume",
    requireRole("student"),
    documentUpload.single("resume"),
    updateStudentResume,
  )
  .post("/noc/regenerate", requireRole("student"), regenerateMyNOC);

export { studentDocumentRoutes };
