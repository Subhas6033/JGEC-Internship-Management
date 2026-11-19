import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
  changeMyPassword,
  updateMySignature,
} from "../services/spoc/spocProfile.service.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { documentUpload } from "../middlewares/documentUpload.middleware.js";

const spocProfileRoutes = Router();

spocProfileRoutes.use(authenticateUser, requireRole("spoc"));

spocProfileRoutes
  .get("/", getMyProfile)
  .patch("/", updateMyProfile)
  .patch("/password", changeMyPassword)
  .put("/signature", documentUpload.single("signature"), updateMySignature);

export { spocProfileRoutes };
