import { Router } from "express";
import { getDepartments } from "../services/admin/admin.department.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const admindDepartmentManagementRoutes = Router();
admindDepartmentManagementRoutes.use(authenticateUser, requireRole("admin"));

admindDepartmentManagementRoutes.get("/", getDepartments);

export { admindDepartmentManagementRoutes };
