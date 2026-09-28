import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  UsersRound,
  XCircle,
} from "lucide-react";

import { Button, Card } from "../index";

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "border-success/30 bg-success/10 text-success",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-danger/30 bg-danger/10 text-danger",
  },
};

const SPOCApplicationListCard = ({ application, onView }) => {
  const status = statusConfig[application.status] ?? statusConfig.pending;

  const StatusIcon = status.icon;

  return (
    <Card
      className="
        flex h-full min-w-0 w-full max-w-full
        flex-col
        overflow-hidden
        border-border
        bg-surface
        shadow-(--shadow-card)
        transition-shadow duration-200
        hover:shadow-(--shadow-card-hover)
      "
    >
      <div
        className="
          flex min-w-0
          flex-1 flex-col
          p-4
          sm:p-5
        "
      >
        {/* Header */}
        <div
          className="
            flex min-w-0
            items-start justify-between
            gap-3
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="
                flex size-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-brand-100
                text-brand-700
              "
            >
              <Building2 size={20} />
            </span>

            <div className="min-w-0">
              <h3
                title={application.company}
                className="
                  truncate
                  text-sm font-bold
                  text-ink
                  sm:text-base
                "
              >
                {application.company}
              </h3>

              <p
                title={application.location}
                className="
                  mt-0.5 flex min-w-0
                  items-center gap-1
                  truncate
                  text-xs text-ink-muted
                  sm:text-sm
                "
              >
                <MapPin size={13} className="shrink-0" />
                <span className="truncate">{application.location}</span>
              </p>
            </div>
          </div>

          {/* Status */}
          <span
            title={status.label}
            className={[
              "flex shrink-0 items-center gap-1.5",
              "rounded-full border px-2.5 py-1",
              "text-[10px] font-semibold",
              "sm:text-xs",
              status.className,
            ].join(" ")}
          >
            <StatusIcon size={13} />
            <span className="hidden sm:inline">{status.label}</span>
          </span>
        </div>

        {/* Application information */}
        <div
          className="
            mt-5 grid min-w-0
            grid-cols-1 gap-3
            sm:grid-cols-2
          "
        >
          <div
            className="
              min-w-0 rounded-xl
              bg-cream
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <UsersRound size={15} className="shrink-0 text-ink-muted" />

              <span className="text-xs text-ink-muted">Selected Students</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-ink">
              {application.students.length} Students
            </p>
          </div>

          <div
            className="
              min-w-0 rounded-xl
              bg-cream
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="shrink-0 text-ink-muted" />

              <span className="text-xs text-ink-muted">
                Application Deadline
              </span>
            </div>

            <p className="mt-1 truncate text-sm font-semibold text-ink">
              {application.deadline}
            </p>
          </div>
        </div>

        {/* NOC */}
        {application.nocReference && (
          <div
            className="
              mt-3 min-w-0
              rounded-xl
              border border-brand-200
              bg-brand-50
              p-3
            "
          >
            <div className="flex items-center gap-2">
              <FileCheck2 size={15} className="shrink-0 text-brand-700" />

              <span className="text-xs font-medium text-brand-700">
                NOC Reference Number
              </span>
            </div>

            <p
              title={application.nocReference}
              className="
                mt-1
                truncate
                text-xs font-semibold
                text-brand-900
                sm:text-sm
              "
            >
              {application.nocReference}
            </p>
          </div>
        )}

        {/* Rejection reason */}
        {application.rejectionReason && (
          <div
            className="
              mt-3 min-w-0
              rounded-xl
              border border-danger/20
              bg-danger/5
              p-3
            "
          >
            <p className="text-xs font-semibold text-danger">
              Rejection Reason
            </p>

            <p
              title={application.rejectionReason}
              className="
                mt-1
                wrap-break-word
                text-xs leading-5
                text-ink-muted
              "
            >
              {application.rejectionReason}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          className="
            mt-auto
            flex min-w-0
            flex-col gap-3
            pt-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <p className="text-xs text-ink-muted">Application ID</p>

            <p
              title={application.id}
              className="
                mt-0.5
                truncate
                text-xs font-semibold
                text-ink
              "
            >
              {application.id}
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => onView(application)}
            className="
              w-full
              shrink-0
              bg-brand-700
              text-cream-soft
              hover:bg-brand-800
              sm:w-auto
            "
          >
            View Application
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SPOCApplicationListCard;
