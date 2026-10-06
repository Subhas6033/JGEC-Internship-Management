import { Router } from "express";
import {
  getTpoApplicationByIdController,
  getTpoApplicationsController,
  acceptApplication,
  sendApplicationBack,
} from "../services/tpo/application.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const tpoApplicationRoutes = Router();

tpoApplicationRoutes
  .use(authenticateUser)
  .get("/tpo", requireRole("TPO"), getTpoApplicationsController)
  .get(
    "/tpo/:applicationId",
    requireRole("TPO"),
    getTpoApplicationByIdController,
  )
  .post("/tpo/:applicationId/accept", requireRole("TPO"), acceptApplication)
  .post(
    "/tpo/:applicationId/send-back",
    requireRole("TPO"),
    sendApplicationBack,
  );

export { tpoApplicationRoutes };
