import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllOrganisations,
  getOrganisationById,
  createOrganisation,
  updateOrganisation,
  deleteOrganisation,
} from "../Organisation/organisation.api";

// params: { page, limit, search, location, sortBy, order }
const useOrganisations = (params = {}) => {
  return useQuery({
    // Every distinct page/filter/sort combination is cached separately.
    queryKey: ["organisations", params],
    queryFn: () => getAllOrganisations(params),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
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
    // ["organisations"] matches every cached page/filter combination.
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

// Call with: mutateAsync(organisationId)
const useDeleteOrganisation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOrganisation,
    onSuccess: (_data, organisationId) => {
      queryClient.invalidateQueries({ queryKey: ["organisations"] });
      queryClient.removeQueries({ queryKey: ["organisation", organisationId] });
    },
  });
};

export {
  useOrganisations,
  useOrganisation,
  useCreateOrganisation,
  useUpdateOrganisation,
  useDeleteOrganisation,
};
