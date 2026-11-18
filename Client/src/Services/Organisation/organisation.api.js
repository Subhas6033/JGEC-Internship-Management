import { apiClient } from "../api/apiClient";

// params: { page, limit, search, location, sortBy, order }
const getAllOrganisations = (params = {}) =>
  apiClient.get("/organisation", { params });

const getOrganisationById = (organisationId) =>
  apiClient.get(`/organisation/${organisationId}`);

const createOrganisation = (organisation) =>
  apiClient.post("/organisation", organisation);

const updateOrganisation = ({ id, ...organisation }) =>
  apiClient.put(`/organisation/${id}`, organisation);

const deleteOrganisation = (organisationId) =>
  apiClient.delete(`/organisation/${organisationId}`);

export {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
};
