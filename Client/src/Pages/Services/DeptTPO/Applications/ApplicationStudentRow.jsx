import { Check, Eye, X } from "lucide-react";
import { Button } from "../../../../Components";

const statusConfig = {
  pending_department_review: {
    label: "Pending review",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  department_accepted: {
    label: "Department accepted",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  department_rejected: {
    label: "Department rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
  sent_to_tpo: {
    label: "Sent to TPO",
    className: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  approved_by_tpo: {
    label: "Approved by TPO",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 ring-red-200",
  },
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

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || {
    label: String(status || "Unknown")
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) => character.toUpperCase()),
    className: "bg-cream-dark text-ink-muted ring-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const ApplicationStudentRow = ({
  student,
  selected = false,
  onSelect,
  onAccept,
  onReject,
  onView,
}) => {
  const canReview = student?.status === "pending_department_review";

  const studentName =
    student?.fullName ||
    student?.name ||
    student?.user?.fullName ||
    "Student name unavailable";

  const handleSelect = () => {
    onSelect?.(student?._id);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-border px-4 py-4 transition-colors last:border-b-0 hover:bg-cream/60 lg:flex-row lg:items-center lg:justify-between">
      {/* Student information */}
      <div className="flex min-w-0 items-start gap-3">
        {canReview && (
          <input
            type="checkbox"
            checked={selected}
            onChange={handleSelect}
            aria-label={`Select ${studentName}`}
            className="mt-3 size-4 shrink-0 cursor-pointer rounded border-border accent-brand-700"
          />
        )}

        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
          {getInitials(studentName)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {studentName}
          </p>

          <p className="mt-0.5 text-xs text-ink-muted">
            Roll number: {student?.rollNumber || "Not available"}
          </p>

          <p className="mt-1 text-xs text-ink-muted">
            {student?.department || student?.branch || "Department unavailable"}
            {student?.semester ? ` · Semester ${student.semester}` : ""}
          </p>
        </div>
      </div>

      {/* Status and actions */}
      <div className="flex flex-wrap items-center gap-2 pl-0 lg:justify-end">
        <StatusBadge status={student?.status} />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onView?.(student)}
        >
          <Eye size={14} />
          View
        </Button>

        {canReview && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onReject?.(student)}
            >
              <X size={14} />
              Reject
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onAccept?.(student)}
            >
              <Check size={14} />
              Accept
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplicationStudentRow;
