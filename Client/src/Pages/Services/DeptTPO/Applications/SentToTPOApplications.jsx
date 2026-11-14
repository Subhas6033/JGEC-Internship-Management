import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import OrganisationGroupList from "./OrganisationGroupList";
import { SPOC_STATUSES } from "./applicationUtils";

const SentToTPOApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = useMemo(
    () =>
      (Array.isArray(filteredApplications) ? filteredApplications : []).filter(
        (application) => SPOC_STATUSES.includes(application?.status),
      ),
    [filteredApplications],
  );

  return (
    <OrganisationGroupList
      applications={applications}
      emptyTitle="Nothing forwarded to SPOC"
      emptyDescription="Applications forwarded to the organisation SPOC will appear here."
    />
  );
};

export default SentToTPOApplications;
