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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/application", studentApplicationRoutes);
app.use("/api/v1/organisation", organisationRoutes);
app.use("/api/v1/dashboard", studentDashboardRoutes);

//Centralize err handlers
app.use(errorMiddleware);
export { app };
