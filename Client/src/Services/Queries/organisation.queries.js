import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
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

const useCreateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrganisation,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["organisations"] }),
  });
};

// Call with: mutateAsync({ id, organisationName, organisationLocation, ... })
const useUpdateOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrganisation,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.invalidateQueries({
        queryKey: ["organisation", variables.id],
      });
    },
  });
};

export {
  useOrganisations,
  useOrganisation,
  useCreateOrganisation,
  useUpdateOrganisation,
};
