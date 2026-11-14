import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import OrganisationGroupList from "./OrganisationGroupList";
import { PENDING_STATUSES } from "./applicationUtils";

const PendingApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = useMemo(
    () =>
      (Array.isArray(filteredApplications) ? filteredApplications : []).filter(
        (application) => PENDING_STATUSES.includes(application?.status),
      ),
    [filteredApplications],
  );

  return (
    <OrganisationGroupList
      applications={applications}
      emptyTitle="No pending applications"
      emptyDescription="Applications waiting for department review will appear here."
    />
  );
};

export default PendingApplications;
