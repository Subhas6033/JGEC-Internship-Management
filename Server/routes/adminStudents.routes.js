import { Router } from "express";
import {
  getAllStudentDetails,
  updateStudentDetails,
  deleteStudentAccount,
} from "../services/admin/admin.students.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const adminStudentManagementRoutes = Router();

adminStudentManagementRoutes.use(authenticateUser, requireRole("admin"));

adminStudentManagementRoutes
  .get("/", getAllStudentDetails)
  .patch("/:studentId", updateStudentDetails)
  .delete("/:studentId", deleteStudentAccount);

export { adminStudentManagementRoutes };
