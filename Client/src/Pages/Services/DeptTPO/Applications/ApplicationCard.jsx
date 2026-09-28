import {
  ArrowRight,
  Building2,
  CalendarDays,
  GraduationCap,
} from "lucide-react";
import { Button, Card } from "../../../../Components";

const statusClasses = {
  pending: "bg-warning/10 text-warning border-warning/20",
  approved: "bg-success/10 text-success border-success/20",
  rejected: "bg-danger/10 text-danger border-danger/20",
};

const statusLabels = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const ApplicationCard = ({ application, onView }) => {
  const { student, company } = application;

  return (
    <Card
      className="
        border-border
        bg-cream-soft
        p-4
        shadow-card
        transition-shadow
        duration-200
        hover:shadow-card-hover
      "
    >
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className="
              flex size-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-brand-700
              text-sm
              font-semibold
              text-white
            "
          >
            {student.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)}
          </div>

          <div className="min-w-0">
            <h3
              className="
                truncate
                text-sm
                font-semibold
                text-ink
              "
            >
              {student.name}
            </h3>

            <p className="mt-0.5 text-xs text-ink-muted">
              {student.rollNumber}
            </p>
          </div>
        </div>

        <span
          className={`
            inline-flex
            w-fit
            items-center
            rounded-full
            border
            px-2.5
            py-1
            text-[11px]
            font-semibold
            ${statusClasses[application.status]}
          `}
        >
          {statusLabels[application.status]}
        </span>
      </div>

      {/* Application information */}
      <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          <Building2
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-ink-muted"
          />

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink-muted">Company</p>

            <p className="truncate text-sm font-medium text-ink">
              {company.name}
            </p>

            <p className="truncate text-xs text-ink-muted">{company.role}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <GraduationCap
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-ink-muted"
          />

          <div className="min-w-0">
            <p className="text-[11px] font-medium text-ink-muted">Academic</p>

            <p className="truncate text-sm font-medium text-ink">
              {student.department}
            </p>

            <p className="text-xs text-ink-muted">{student.semester}</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CalendarDays
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-ink-muted"
          />

          <div>
            <p className="text-[11px] font-medium text-ink-muted">
              Internship Period
            </p>

            <p className="text-sm font-medium text-ink">
              {application.internshipStart}
            </p>

            <p className="text-xs text-ink-muted">
              to {application.internshipEnd}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <CalendarDays
            size={16}
            strokeWidth={1.8}
            className="mt-0.5 shrink-0 text-ink-muted"
          />

          <div>
            <p className="text-[11px] font-medium text-ink-muted">Submitted</p>

            <p className="text-sm font-medium text-ink">
              {application.submittedAt}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="
          mt-4
          flex
          items-center
          justify-between
          border-t
          border-border
          pt-3
        "
      >
        <p className="text-[11px] text-ink-muted">
          Application ID:{" "}
          <span className="font-medium text-ink">{application.id}</span>
        </p>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => onView?.(application)}
        >
          View
          <ArrowRight size={14} />
        </Button>
      </div>
    </Card>
  );
};

export default ApplicationCard;
