import { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CompanyApplicationGroup from "./CompanyApplicationGroup";

const getOrganisation = (application) =>
  application?._organisation ||
  application?.organisation ||
  application?.company ||
  null;

const AllCompanyApplications = () => {
  const context = useOutletContext() || {};

  const sourceApplications =
    context.filteredApplications ?? context.applications ?? [];

  const applications = Array.isArray(sourceApplications)
    ? sourceApplications
    : [];

  const applicationGroups = useMemo(() => {
    const groups = new Map();

    applications.forEach((application, index) => {
      const organisation = getOrganisation(application);

      // Keep records even if organisation details are not populated.
      const organisationId =
        organisation?._id ||
        application?.organisationId ||
        application?._organisationId ||
        `unknown-organisation-${index}`;

      if (!groups.has(organisationId)) {
        groups.set(organisationId, {
          _id: organisationId,
          organisation: organisation || {
            _id: organisationId,
            name: "Organisation details unavailable",
          },
          applications: [],
        });
      }

      groups.get(organisationId).applications.push(application);
    });

    return Array.from(groups.values());
  }, [applications]);

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream-soft px-5 py-12 text-center">
        <p className="text-sm font-semibold text-ink">
          No applications to display
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          Applications matching your selected filters will appear here.
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
