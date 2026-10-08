import express, { json, urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const CORS_ORIGIN = process.env.CORS_ORIGIN;
if (!CORS_ORIGIN) throw new Error(`Please provide the CORS Value....`);

// Basic app middelwares setup
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(json({ limit: "100kb" }));
app.use(urlencoded({ limit: "100kb", extended: true }));
app.use(cookieParser());
app.disable("x-powered-by");
app.use(helmet());

// Routes
import { authRoutes } from "./routes/auth.routes.js";
import { studentApplicationRoutes } from "./routes/studentApplication.routes.js";
import { organisationRoutes } from "./routes/organisation.routes.js";
import { studentDashboardRoutes } from "./routes/studentDashboard.routes.js";
import { studentDocumentRoutes } from "./routes/studentDocuments.routes.js";
import { studentNotificationRoutes } from "./routes/studentNotifications.routes.js";
import { tpoDashboardRoutes } from "./routes/depttpoDashboard.routes.js";
import { tpoApplicationRoutes } from "./routes/tpoApplication.routes.js";
import { spocApplicationRoutes } from "./routes/spocApplication.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/application", studentApplicationRoutes);
app.use("/api/v1/organisation", organisationRoutes);
app.use("/api/v1/dashboard", studentDashboardRoutes);
app.use("/api/v1/student/documents", studentDocumentRoutes);
app.use("/api/v1/student/notifications", studentNotificationRoutes);
app.use("/api/v1/tpo/dashboard", tpoDashboardRoutes);
app.use("/api/v1/applications", tpoApplicationRoutes);
app.use("/api/v1/applications", spocApplicationRoutes);

//Centralize err handlers
app.use(errorMiddleware);
export { app };
