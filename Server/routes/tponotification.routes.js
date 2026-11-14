import { Router } from "express";
import {
  listTpoNotifications,
  markAllTpoNotificationsRead,
  markTpoNotificationRead,
} from "../services/tpo/notification.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const tpoNotificationsRoutes = Router();

tpoNotificationsRoutes.use(authenticateUser).use(requireRole("tpo"));

tpoNotificationsRoutes
  .get("/notifications", listTpoNotifications)
  .patch("/notifications/read-all", markAllTpoNotificationsRead)
  .patch("/notifications/:notificationId/read", markTpoNotificationRead);

export { tpoNotificationsRoutes };
