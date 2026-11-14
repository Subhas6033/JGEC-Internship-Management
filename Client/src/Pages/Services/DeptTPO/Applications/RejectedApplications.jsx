import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import OrganisationGroupList from "./OrganisationGroupList";
import { REJECTED_STATUSES } from "./applicationUtils";

const RejectedApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = useMemo(
    () =>
      (Array.isArray(filteredApplications) ? filteredApplications : []).filter(
        (application) => REJECTED_STATUSES.includes(application?.status),
      ),
    [filteredApplications],
  );

  return (
    <OrganisationGroupList
      applications={applications}
      emptyTitle="No rejected applications"
      emptyDescription="Applications rejected by the department will appear here."
    />
  );
};

export default RejectedApplications;
