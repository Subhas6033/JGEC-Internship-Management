import { useOutletContext } from "react-router-dom";
import OrganisationGroupList from "./OrganisationGroupList";

const AllCompanyApplications = () => {
  const context = useOutletContext() || {};
  const source = context.filteredApplications ?? context.applications ?? [];
  return (
    <OrganisationGroupList applications={Array.isArray(source) ? source : []} />
  );
};

export default AllCompanyApplications;
