import { Router } from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { getDeptTpoDashboardController } from "../services/tpo/deptTpoDashboard.controller.js";

const tpoDashboardRoutes = Router();

tpoDashboardRoutes.get(
  "/",
  authenticateUser,
  requireRole("TPO"),
  getDeptTpoDashboardController,
);

export { tpoDashboardRoutes };
