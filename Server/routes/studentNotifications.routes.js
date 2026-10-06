import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import {
  getMyNotifications,
  markMyNotificationRead,
  markAllMyNotificationsRead,
  deleteMyNotification,
  getMyUnreadNotificationCount,
} from "../services/students/studentNotification.controller.js";

const studentNotificationRoutes = express.Router();

studentNotificationRoutes.use(authenticateUser);
studentNotificationRoutes
  .get("/", requireRole("student"), getMyNotifications)
  .get("/unread-count", requireRole("student"), getMyUnreadNotificationCount)
  .patch(
    "/:notificationId/read",
    requireRole("student"),
    markMyNotificationRead,
  )
  .patch("/read-all", requireRole("student"), markAllMyNotificationsRead)
  .delete("/:notificationId", requireRole("student"), deleteMyNotification);

export { studentNotificationRoutes };
