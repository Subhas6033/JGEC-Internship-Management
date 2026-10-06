import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CompanyApplicationGroup from "./CompanyApplicationGroup";

const PENDING_STATUSES = ["submitted", "under_tpo_review", "update_required"];

const PendingApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = Array.isArray(filteredApplications)
    ? filteredApplications
    : [];

  const pendingApplications = useMemo(
    () =>
      applications.filter((application) =>
        PENDING_STATUSES.includes(application?.status),
      ),
    [applications],
  );

  const groups = useMemo(() => {
    const grouped = new Map();

    pendingApplications.forEach((application) => {
      const organisation = application?.organisation;

      if (!organisation?._id) {
        return;
      }

      if (!grouped.has(organisation._id)) {
        grouped.set(organisation._id, {
          _id: organisation._id,
          organisation,
          applications: [],
        });
      }

      grouped.get(organisation._id).applications.push(application);
    });

    return Array.from(grouped.values());
  }, [pendingApplications]);

  if (groups.length === 0) {
    return (
      <EmptyState
        title="No pending applications"
        description="There are no applications waiting for department review."
      />
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <CompanyApplicationGroup key={group._id} group={group} />
      ))}
    </div>
  );
};

const EmptyState = ({ title, description }) => (
  <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-cream-soft px-6 text-center">
    <div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-xs text-ink-muted">{description}</p>
    </div>
  </div>
);

export default PendingApplications;
