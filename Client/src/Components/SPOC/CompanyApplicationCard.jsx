import { ArrowRight, Building2, CalendarDays, UsersRound } from "lucide-react";
import { Card } from "../index";
import ApplicationStatusBadge from "./ApplicationStatusBadge";

const CompanyApplicationCard = ({ application, onView }) => {
  return (
    <Card
      className="
        border-border
        bg-surface
        shadow-(--shadow-card)
        transition-shadow duration-200
        hover:shadow-(--shadow-card-hover)
      "
    >
      <Card.Content className="p-5 sm:p-6">
        <div className="p-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
              <Building2 size={21} />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-ink sm:text-base">
                {application.company}
              </h3>

              <p className="mt-0.5 text-xs text-ink-muted sm:text-sm">
                {application.location}
              </p>
            </div>
          </div>

          <ApplicationStatusBadge status={application.status} />
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-cream p-3">
            <div className="flex items-center gap-2 text-ink-muted">
              <UsersRound size={15} />

              <span className="text-xs font-medium">Selected Students</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-ink">
              {application.students.length} Students
            </p>
          </div>

          <div className="rounded-lg bg-cream p-3">
            <div className="flex items-center gap-2 text-ink-muted">
              <CalendarDays size={15} />

              <span className="text-xs font-medium">Application Deadline</span>
            </div>

            <p className="mt-1 text-sm font-semibold text-ink">
              {application.deadline}
            </p>
          </div>
        </div>

        {application.nocReference && (
          <div className="mt-4 rounded-lg border border-brand-200 bg-brand-50 p-3">
            <p className="text-[11px] font-medium text-brand-700">
              NOC Reference Number
            </p>

            <p className="mt-1 text-sm font-semibold text-brand-900">
              {application.nocReference}
            </p>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => onView?.(application)}
            className="
              focus-ring
              inline-flex items-center gap-2
              rounded-lg bg-brand-700
              px-3.5 py-2
              text-xs font-semibold text-white
              transition-colors
              hover:bg-brand-800
              sm:px-4 sm:py-2.5 sm:text-sm
            "
          >
            Review Application
            <ArrowRight size={15} />
          </button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CompanyApplicationCard;
