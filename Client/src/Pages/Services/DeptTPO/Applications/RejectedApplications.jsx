import { useOutletContext } from "react-router-dom";

import CompanyApplicationGroup from "./CompanyApplicationGroup";

const RejectedApplications = () => {
  const { filteredGroups } = useOutletContext();

  const groups = filteredGroups
    .map((group) => ({
      ...group,
      students: group.students.filter(
        (student) => student.status === "department_rejected",
      ),
    }))
    .filter((group) => group.students.length > 0);

  return (
    <div className="space-y-4">
      {groups.length > 0 ? (
        groups.map((group) => (
          <CompanyApplicationGroup key={group.id} group={group} />
        ))
      ) : (
        <EmptyState
          title="No rejected applications"
          description="No applications have been rejected by the department."
        />
      )}
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

export default RejectedApplications;
