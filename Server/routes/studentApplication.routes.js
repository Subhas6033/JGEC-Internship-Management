import { Router } from "express";
import { submitStudentApplication } from "../services/students/applications.service.js";
import { verifyStudentJWT } from "../middlewares/auth.middleware.js";

const studentApplicationRoutes = Router();

studentApplicationRoutes.post(
  "/students/apply",
  verifyStudentJWT,
  submitStudentApplication,
);

export { studentApplicationRoutes };
