import { useQuery } from "@tanstack/react-query";
import {
  getAllOrganisations,
  getOrganisationById,
} from "../Organisation/organisation.api";

const useOrganisations = () => {
  return useQuery({
    queryKey: ["organisations"],
    queryFn: getAllOrganisations,
    staleTime: 5 * 60 * 1000,
  });
};

const useOrganisation = (organisationId) => {
  return useQuery({
    queryKey: ["organisation", organisationId],
    queryFn: () => getOrganisationById(organisationId),
    enabled: Boolean(organisationId),
    staleTime: 5 * 60 * 1000,
  });
};

export { useOrganisations, useOrganisation };
