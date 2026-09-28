import { useOutletContext } from "react-router-dom";

import CompanyApplicationGroup from "./CompanyApplicationGroup";

const AllCompanyApplications = () => {
  const { filteredGroups } = useOutletContext();

  if (filteredGroups.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-cream-soft px-6 text-center">
        <h3 className="text-sm font-semibold text-ink">No companies found</h3>

        <p className="mt-1 max-w-sm text-xs text-ink-muted">
          Try changing your search or company status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredGroups.map((group) => (
        <CompanyApplicationGroup key={group.id} group={group} />
      ))}
    </div>
  );
};

export default AllCompanyApplications;
