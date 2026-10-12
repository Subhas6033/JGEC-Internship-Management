import React from "react";
import { Card } from "../../../../Components/index";

import OrganisationHeader from "./OrganisationHeader";
import ApplicationsTable from "./ApplicationsTable";
import {
  getAcceptedApplications,
  getApplicationId,
  isPendingForSpoc,
} from "./spocDashboard.utils";

const OrganisationCard = ({
  organisation,
  isExpanded,
  selectedIds,
  actionLoading,
  bulkLoading,
  onToggleOrganisation,
  onToggleSelection,
  onToggleAcceptedSelection,
  onGenerateNoc,
  onView,
  onDecision,
}) => {
  const pendingCount =
    organisation.applications.filter(isPendingForSpoc).length;

  const acceptedApplications = getAcceptedApplications(organisation);
  const acceptedCount = acceptedApplications.length;

  const acceptedIds = acceptedApplications
    .map(getApplicationId)
    .filter(Boolean);

  const allAcceptedSelected =
    acceptedIds.length > 0 &&
    acceptedIds.every((id) => selectedIds.includes(id));

  return (
    <Card className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
      <OrganisationHeader
        organisation={organisation}
        isExpanded={isExpanded}
        pendingCount={pendingCount}
        acceptedCount={acceptedCount}
        allAcceptedSelected={allAcceptedSelected}
        loading={bulkLoading}
        onToggle={() =>
          onToggleOrganisation(organisation.id || organisation.name)
        }
        onToggleBulkSelection={() =>
          onToggleAcceptedSelection(acceptedApplications)
        }
        onGenerateNoc={() => onGenerateNoc(organisation)}
      />

      {isExpanded && (
        <ApplicationsTable
          applications={organisation.applications}
          selectedIds={selectedIds}
          actionLoading={actionLoading}
          bulkLoading={bulkLoading}
          onToggleSelection={onToggleSelection}
          onView={onView}
          onDecision={onDecision}
        />
      )}
    </Card>
  );
};

export default OrganisationCard;
