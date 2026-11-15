import { Router } from "express";
import {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from "../services/organisation/organisation.controller.js";

const organisationRoutes = Router();

organisationRoutes
  .get("/", getAllOrganisations)
  .post("/", createOrganisation)
  .put("/:organisationId", updateOrganisation)
  .get("/:organisationId", getOrganisationById)
  .delete("/:organisationId", deleteOrganisation);

export { organisationRoutes };
