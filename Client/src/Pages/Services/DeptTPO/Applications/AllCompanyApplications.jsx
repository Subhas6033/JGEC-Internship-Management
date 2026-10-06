import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CompanyApplicationGroup from "./CompanyApplicationGroup";

const AllCompanyApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};
  const applications = Array.isArray(filteredApplications)
    ? filteredApplications
    : [];

  const applicationGroups = useMemo(() => {
    const groups = new Map();
    applications.forEach((application) => {
      const organisation = application?.organisation;
      if (!organisation?._id) {
        return;
      }
      if (!groups.has(organisation._id)) {
        groups.set(organisation._id, {
          _id: organisation._id,
          organisation,
          applications: [],
        });
      }
      groups.get(organisation._id).applications.push(application);
    });
    return Array.from(groups.values());
  }, [applications]);

  if (applicationGroups.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-cream-soft p-8 text-center">
        <p className="text-sm font-medium text-ink">No applications found</p>
        <p className="mt-1 text-xs text-ink-muted">
          No applications match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applicationGroups.map((group) => (
        <CompanyApplicationGroup key={group._id} group={group} />
      ))}
    </div>
  );
};

export default AllCompanyApplications;
