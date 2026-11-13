import {
  ArrowRight,
  Building2,
  CalendarDays,
  GraduationCap,
} from "lucide-react";

import { Button, Card } from "../../../../Components";

const statusConfig = {
  pending: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  pending_department_review: {
    label: "Pending department review",
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  department_accepted: {
    label: "Department accepted",
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
  approved_by_tpo: {
    label: "Approved by TPO",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  sent_to_spoc: {
    label: "Sent to SPOC",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  sent_to_tpo: {
    label: "Sent to TPO",
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
  department_rejected: {
    label: "Department rejected",
    className: "border-red-200 bg-red-50 text-red-700",
  },
};

const getDisplayDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name) => {
  if (!name) return "ST";

  return String(name)
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const InfoItem = ({ icon: Icon, label, value, secondary }) => (
  <div className="flex min-w-0 items-start gap-2.5">
    <Icon
      size={16}
      strokeWidth={1.8}
      className="mt-0.5 shrink-0 text-ink-muted"
    />

    <div className="min-w-0">
      <p className="text-[11px] font-medium text-ink-muted">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-ink">
        {value || "Not specified"}
      </p>

      {secondary && (
        <p className="mt-0.5 truncate text-xs text-ink-muted">{secondary}</p>
      )}
    </div>
  </div>
);

const ApplicationCard = ({ application, onView }) => {
  const student = application?.student || application?._student || {};

  const company =
    application?.company ||
    application?._organisation ||
    application?.organisation ||
    {};

  const studentName =
    student.fullName ||
    student.name ||
    student.user?.fullName ||
    student.user?.name ||
    "Student name unavailable";

  const companyName =
    company.name ||
    company.organisationName ||
    company.companyName ||
    "Organisation unavailable";

  const status = statusConfig[application?.status] || {
    label: String(application?.status || "Unknown")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()),
    className: "border-border bg-cream text-ink-muted",
  };

  const internshipStart =
    application?.internshipStart || application?.internship?.startDate;

  const internshipEnd =
    application?.internshipEnd || application?.internship?.endDate;

  const submittedAt = application?.submittedAt || application?.createdAt;

  return (
    <Card className="overflow-hidden border border-border bg-cream-soft p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover sm:p-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-sm font-semibold text-white">
            {getInitials(studentName)}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">
              {studentName}
            </h3>

            <p className="mt-0.5 text-xs text-ink-muted">
              Roll number: {student.rollNumber || "Not available"}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-[11px] font-semibold ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Application details */}
      <div className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2 xl:grid-cols-4">
        <InfoItem
          icon={Building2}
          label="Organisation"
          value={companyName}
          secondary={
            company.role || application?.internshipRole || application?.role
          }
        />

        <InfoItem
          icon={GraduationCap}
          label="Academic details"
          value={student.department || student.branch}
          secondary={
            student.semester ? `Semester ${student.semester}` : student.course
          }
        />

        <InfoItem
          icon={CalendarDays}
          label="Internship period"
          value={getDisplayDate(internshipStart)}
          secondary={`To ${getDisplayDate(internshipEnd)}`}
        />

        <InfoItem
          icon={CalendarDays}
          label="Submitted on"
          value={getDisplayDate(submittedAt)}
        />
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 break-all text-[11px] text-ink-muted">
          Application ID:{" "}
          <span className="font-medium text-ink">
            {application?._id || "Not available"}
          </span>
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onView?.(application)}
        >
          View details
          <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;
