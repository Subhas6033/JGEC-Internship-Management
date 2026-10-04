import { Router } from "express";
import {
  submitStudentApplication,
  getMyStudentApplications,
} from "../services/students/applications.service.js";
import { verifyStudentJWT } from "../middlewares/auth.middleware.js";

const studentApplicationRoutes = Router();

studentApplicationRoutes
  .post("/students/apply", verifyStudentJWT, submitStudentApplication)
  .get("/students/getapplications", verifyStudentJWT, getMyStudentApplications);

export { studentApplicationRoutes };
