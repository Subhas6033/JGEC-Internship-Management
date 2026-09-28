import { CalendarClock, CheckCircle2, Clock3, Edit3 } from "lucide-react";

import { Button, Card } from "../../../../Components";

const DeadlineCard = ({ group, onEdit }) => {
  const deadline = new Date(group.deadline);
  const now = new Date();

  const isClosed = group.status === "closed" || deadline <= now;

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <CalendarClock size={20} strokeWidth={1.8} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                {group.company.name}
              </h2>

              <span
                className={
                  isClosed
                    ? "rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-semibold text-ink-muted"
                    : "rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                }
              >
                {isClosed ? "Deadline Passed" : "Applications Open"}
              </span>
            </div>

            <p className="mt-1 text-sm text-ink-muted">{group.company.role}</p>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                {isClosed ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}

                {deadline.toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>

              <span>{group.students.length} applications</span>
            </div>
          </div>
        </div>

        {!isClosed && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onEdit(group)}
          >
            <Edit3 size={14} />
            Change Deadline
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DeadlineCard;
