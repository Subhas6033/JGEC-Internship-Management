import { useOutletContext } from "react-router-dom";

import CompanyApplicationGroup from "./CompanyApplicationGroup";

const SentToTPOApplications = () => {
  const { filteredGroups } = useOutletContext();

  const groups = filteredGroups
    .map((group) => ({
      ...group,
      students: group.students.filter(
        (student) => student.status === "sent_to_tpo",
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
        <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-cream-soft px-6 text-center">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Nothing sent to TPO
            </h3>

            <p className="mt-1 text-xs text-ink-muted">
              Accepted applications will appear here after being forwarded to
              the central TPO.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentToTPOApplications;
