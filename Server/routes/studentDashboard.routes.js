import { Router } from "express";
import { verifyStudentJWT } from "../middlewares/auth.middleware.js";
import { getStudentDashboard } from "../services/students/dashboard.service.js";

const studentDashboardRoutes = Router();

studentDashboardRoutes.get("/students", verifyStudentJWT, getStudentDashboard);

export { studentDashboardRoutes };
