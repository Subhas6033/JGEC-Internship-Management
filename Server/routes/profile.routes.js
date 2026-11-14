import { Router } from "express";
import {
  updateProfile,
  updateUserSignature,
} from "../services/auth/profile.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { documentUpload } from "../middlewares/documentUpload.middleware.js";

const profileRoutes = Router();

profileRoutes
  .patch(
    "/",
    authenticateUser,
    requireRole("TPO", "SPOC", "ADMIN"),
    updateProfile,
  )
  .patch(
    "/signature",
    authenticateUser,
    requireRole("TPO", "SPOC", "ADMIN"),
    documentUpload.single("signature"),
    updateUserSignature,
  );

export { profileRoutes };
