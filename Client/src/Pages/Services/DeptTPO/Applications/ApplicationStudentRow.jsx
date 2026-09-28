import { Check, Eye, X } from "lucide-react";

import { Button } from "../../../../Components";

const ApplicationStudentRow = ({
  student,
  selected,
  onSelect,
  onAccept,
  onReject,
  onView,
}) => {
  const canReview = student.status === "pending_department_review";

  return (
    <div className="flex flex-col gap-4 border-b border-border px-4 py-4 last:border-b-0 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-3">
        {canReview && (
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(student.id)}
            className="mt-1 size-4 rounded border-border"
          />
        )}

        <div>
          <p className="text-sm font-semibold text-ink">{student.name}</p>

          <p className="mt-0.5 text-xs text-ink-muted">{student.rollNumber}</p>

          <p className="mt-1 text-xs text-ink-muted">
            {student.department} · {student.semester}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={student.status} />

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => onView(student)}
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
              onClick={() => onReject(student)}
            >
              <X size={14} />
              Reject
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onAccept(student)}
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

const StatusBadge = ({ status }) => {
  const config = {
    pending_department_review: [
      "Pending Review",
      "bg-cream-dark text-ink-muted",
    ],

    department_accepted: ["Department Accepted", "bg-brand-100 text-brand-700"],

    department_rejected: ["Rejected", "bg-cream-dark text-ink-muted"],

    sent_to_tpo: ["Sent to TPO", "bg-brand-700 text-white"],
  };

  const [label, className] = config[status] || config.pending_department_review;

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}
    >
      {label}
    </span>
  );
};

export default ApplicationStudentRow;
