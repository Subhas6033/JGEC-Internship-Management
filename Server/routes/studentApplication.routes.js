import { Router } from "express";
import {
  submitStudentApplication,
  getMyStudentApplications,
} from "../services/students/applications.service.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const studentApplicationRoutes = Router();

studentApplicationRoutes
  .post(
    "/students/apply",
    authenticateUser,
    requireRole("student"),
    submitStudentApplication,
  )
  .get(
    "/students/getapplications",
    authenticateUser,
    requireRole("student"),
    getMyStudentApplications,
  );

export { studentApplicationRoutes };
