import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getStudentDashboard } from "../services/students/dashboard.service.js";

const studentDashboardRoutes = Router();
studentDashboardRoutes.get(
  "/students",
  authenticateUser,
  requireRole("student"),
  getStudentDashboard,
);

export { studentDashboardRoutes };
