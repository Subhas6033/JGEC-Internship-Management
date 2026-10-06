import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CompanyApplicationGroup from "./CompanyApplicationGroup";

const SENT_TO_SPOC_STATUSES = ["under_spoc_review", "approved_by_spoc"];

const SentToTPOApplications = () => {
  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = Array.isArray(filteredApplications)
    ? filteredApplications
    : [];

  const sentApplications = useMemo(
    () =>
      applications.filter((application) =>
        SENT_TO_SPOC_STATUSES.includes(application?.status),
      ),
    [applications],
  );

  const groups = useMemo(() => {
    const grouped = new Map();

    sentApplications.forEach((application) => {
      const organisation = application?.organisation;

      if (!organisation?._id) return;

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
  }, [sentApplications]);

  if (groups.length === 0) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-border bg-cream-soft px-6 text-center">
        <div>
          <h3 className="text-sm font-semibold text-ink">
            Nothing sent to SPOC
          </h3>

          <p className="mt-1 text-xs text-ink-muted">
            Applications forwarded to the SPOC will appear here.
          </p>
        </div>
      </div>
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

export default SentToTPOApplications;
