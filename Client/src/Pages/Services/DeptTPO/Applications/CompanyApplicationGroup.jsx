import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPin,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../../../Components";

const PENDING_STATUSES = ["submitted", "under_tpo_review", "update_required"];

const SPOC_STATUSES = ["under_spoc_review", "approved_by_spoc"];

const STATUS_CONFIG = {
  submitted: {
    label: "Submitted",
    className: "bg-cream-dark text-ink-muted",
  },
  under_tpo_review: {
    label: "Under TPO Review",
    className: "bg-cream-dark text-ink-muted",
  },
  update_required: {
    label: "Update Required",
    className: "bg-amber-100 text-amber-800",
  },
  approved_by_tpo: {
    label: "Approved by TPO",
    className: "bg-green-100 text-green-800",
  },
  under_spoc_review: {
    label: "Under SPOC Review",
    className: "bg-blue-100 text-blue-800",
  },
  approved_by_spoc: {
    label: "Approved by SPOC",
    className: "bg-green-100 text-green-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800",
  },
  withdrawn: {
    label: "Withdrawn",
    className: "bg-gray-100 text-gray-700",
  },
  draft: {
    label: "Draft",
    className: "bg-gray-100 text-gray-700",
  },
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const CompanyApplicationGroup = ({ group }) => {
  const navigate = useNavigate();

  const applications = Array.isArray(group?.applications)
    ? group.applications
    : [];

  const organisation = group?.organisation || {};

  const pendingApplications = applications.filter((application) =>
    PENDING_STATUSES.includes(application?.status),
  );

  const acceptedApplications = applications.filter(
    (application) => application?.status === "approved_by_tpo",
  );

  const sentToSpocApplications = applications.filter((application) =>
    SPOC_STATUSES.includes(application?.status),
  );

  const latestEndDate = applications.reduce((latest, application) => {
    const currentDate = application?.tentativeEndDate;

    if (!currentDate) {
      return latest;
    }

    if (!latest) {
      return currentDate;
    }

    return new Date(currentDate) > new Date(latest) ? currentDate : latest;
  }, null);

  const firstApplication = applications[0];

  const handleReviewApplications = () => {
    const applicationId = firstApplication?._id;

    if (!applicationId) {
      console.error(
        "Unable to review applications: application ID is missing.",
      );
      return;
    }

    navigate(`/depttpo/applications/${applicationId}`);
  };

  const getStatusConfig = (status) => {
    return (
      STATUS_CONFIG[status] || {
        label: status || "Unknown",
        className: "bg-cream-dark text-ink-muted",
      }
    );
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-brand-700">
              <Building2 size={22} strokeWidth={1.8} />
            </span>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-lg font-semibold text-ink">
                  {organisation?.organisationName || "Unknown Organisation"}
                </h2>

                {applications.length > 0 && (
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Active Applications
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm text-ink-muted">
                {firstApplication?.designation || "Internship"}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
                {organisation?.organisationLocation && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} strokeWidth={1.8} />
                    {organisation.organisationLocation}
                  </span>
                )}

                {firstApplication?.modeOfInternship && (
                  <span className="capitalize">
                    {firstApplication.modeOfInternship}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 rounded-xl border border-border bg-cream-soft px-4 py-3">
            <p className="text-xs text-ink-muted">Latest internship end</p>

            <div className="mt-1 flex items-center gap-2">
              <CalendarClock
                size={16}
                strokeWidth={1.8}
                className="text-ink-muted"
              />

              <p className="text-sm font-semibold text-ink">
                {formatDate(latestEndDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid border-y border-border sm:grid-cols-4">
        <StatItem icon={Users} label="Students" value={applications.length} />

        <StatItem
          icon={Clock3}
          label="Pending"
          value={pendingApplications.length}
        />

        <StatItem
          icon={CheckCircle2}
          label="Accepted"
          value={acceptedApplications.length}
        />

        <StatItem
          icon={Send}
          label="Sent to SPOC"
          value={sentToSpocApplications.length}
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Student Applications
            </h3>

            <p className="mt-1 text-xs text-ink-muted">
              {applications.length}{" "}
              {applications.length === 1
                ? "student applied"
                : "students applied"}{" "}
              for this internship.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReviewApplications}
            disabled={!firstApplication?._id}
          >
            Review Applications
            <ArrowRight size={14} />
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {applications.map((application) => {
            const statusConfig = getStatusConfig(application?.status);

            return (
              <div
                key={application?._id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-cream-soft p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {application?.student?.fullName || "Unknown Student"}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
                    {application?.student?.rollNumber && (
                      <span>{application.student.rollNumber}</span>
                    )}

                    {application?.student?.department && (
                      <span>{application.student.department}</span>
                    )}

                    {application?.designation && (
                      <span>{application.designation}</span>
                    )}
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const StatItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 border-border px-5 py-3 sm:border-r last:border-r-0">
      <Icon size={16} strokeWidth={1.8} className="shrink-0 text-ink-muted" />

      <div>
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
};

export default CompanyApplicationGroup;
