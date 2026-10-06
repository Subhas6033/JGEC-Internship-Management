import { useQuery } from "@tanstack/react-query";
import { getCompanyApplications } from "../../Services/Application/companyApplicationsApi";

const useCompanyApplications = (organisationId) => {
  return useQuery({
    queryKey: ["dept-tpo", "company-applications", organisationId],
    queryFn: () => getCompanyApplications(organisationId),
    enabled: Boolean(organisationId),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};

export { useCompanyApplications };
