import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getSpocDashboard } from "../services/spoc/spocDashboard.controller.js";

const spocDashboardRoutes = Router();

spocDashboardRoutes.get(
  "/spoc",
  authenticateUser,
  requireRole("spoc"),
  getSpocDashboard
);

export { spocDashboardRoutes };