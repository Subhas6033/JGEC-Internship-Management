import { apiClient } from "../api/apiClient";

const getAllOrganisations = () => apiClient.get("/organisation");
const getOrganisationById = (organisationId) =>
  apiClient.get(`/organisation/${organisationId}`);

const createOrganisation = (organisation) =>
  apiClient.post("/organisation", organisation);

const updateOrganisation = ({ id, ...organisation }) =>
  apiClient.put(`/organisation/${id}`, organisation);

export {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
};
