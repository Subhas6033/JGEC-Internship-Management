import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getApiData,
  getTpoApplications,
  getTpoApplicationById,
  getTpoApplicationsByOrganisation,
  acceptTpoApplication,
  sendBackTpoApplication,
} from "../../Services/Application/tpoApplication.api";

// Get all the applications
const useTpoApplications = ({ search = "", status = "all" } = {}) => {
  return useQuery({
    queryKey: ["tpoApplications", search, status],

    queryFn: async () => {
      const response = await getTpoApplications({
        search,
        status,
      });

      return getApiData(response);
    },

    staleTime: 30 * 1000,
  });
};

// Get the application by ID
const useTpoApplication = (applicationId) => {
  return useQuery({
    queryKey: ["tpoApplication", applicationId],

    queryFn: async () => {
      const response = await getTpoApplicationById(applicationId);

      const application = getApiData(response);

      /**
       * React Query does not allow the query
       * function to return undefined.
       *
       * If the backend returns no application,
       * return null instead.
       */
      return application ?? null;
    },

    enabled: Boolean(applicationId),

    staleTime: 30 * 1000,
  });
};

// Get applications by the organisations
const useTpoApplicationsByOrganisation = (organisationId) => {
  return useQuery({
    queryKey: ["tpoApplications", "organisation", organisationId],

    queryFn: async () => {
      const response = await getTpoApplicationsByOrganisation(organisationId);

      return getApiData(response);
    },

    enabled: Boolean(organisationId),

    staleTime: 30 * 1000,
  });
};

// Accept the applications
const useAcceptTpoApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicationId) => {
      const response = await acceptTpoApplication(applicationId);

      return getApiData(response);
    },

    onSuccess: (_data, applicationId) => {
      /**
       * Refresh current application
       */
      queryClient.invalidateQueries({
        queryKey: ["tpoApplication", applicationId],
      });

      /**
       * Refresh application lists
       */
      queryClient.invalidateQueries({
        queryKey: ["tpoApplications"],
      });
    },
  });
};

// Send applications back to the students
const useSendBackTpoApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ applicationId, reason }) => {
      const response = await sendBackTpoApplication(applicationId, reason);

      return getApiData(response);
    },

    onSuccess: (_data, variables) => {
      /**
       * Refresh current application
       */
      queryClient.invalidateQueries({
        queryKey: ["tpoApplication", variables.applicationId],
      });

      /**
       * Refresh application lists
       */
      queryClient.invalidateQueries({
        queryKey: ["tpoApplications"],
      });
    },
  });
};

export {
  useTpoApplications,
  useTpoApplication,
  useTpoApplicationsByOrganisation,
  useAcceptTpoApplication,
  useSendBackTpoApplication,
};
