import express from "express";
import { getAdminDashboardController } from "../services/admin/admin.dashboard.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const adminDashboardRoutes = express.Router();

adminDashboardRoutes.get(
  "/dashboard",
  authenticateUser,
  requireRole("admin"),
  getAdminDashboardController,
);

export { adminDashboardRoutes };
