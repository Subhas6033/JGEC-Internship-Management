import { Router } from "express";
import { getAnalytics } from "../services/admin/admin.analytics.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const adminAnalyticsRoutes = Router();
adminAnalyticsRoutes.use(authenticateUser, requireRole("admin"));

adminAnalyticsRoutes.get("/", getAnalytics);

export { adminAnalyticsRoutes };