import { apiClient } from "../api/apiClient";

const getAllOrganisations = () => apiClient.get("/organisation");
const getOrganisationById = (organisationId) =>
  apiClient.get(`/organisation/${organisationId}`);

export { getAllOrganisations, getOrganisationById };
