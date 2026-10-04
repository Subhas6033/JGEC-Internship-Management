import { Router } from "express";
import {
  getAllOrganisations,
  getOrganisationById,
} from "../services/organisation/organisation.controller.js";

const organisationRoutes = Router();

organisationRoutes
  .get("/", getAllOrganisations)
  .get("/:organisationId", getOrganisationById);

export { organisationRoutes };
