import { Router } from "express";
import {
  getStaff,
  getStaffStats,
  createStaff,
  updateStaff,
  toggleStaffStatus,
} from "../services/admin/admin.staf.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const adminStaffManagementRoutes = Router();
adminStaffManagementRoutes.use(authenticateUser, requireRole("admin"));

adminStaffManagementRoutes
  .get("/stats", getStaffStats)
  .get("/", getStaff)
  .post("/", createStaff)
  .put("/:id", updateStaff)
  .patch("/:id/status", toggleStaffStatus);

export { adminStaffManagementRoutes };
