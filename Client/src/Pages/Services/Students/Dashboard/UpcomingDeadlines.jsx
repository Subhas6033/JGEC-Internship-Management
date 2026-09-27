import { CalendarClock } from "lucide-react";
import { Card } from "../../../../Components/index";
import { upcomingDeadlines } from "./dashboard.data";

const UpcomingDeadlines = () => {
  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-dark text-ink">
          <CalendarClock size={17} />
        </div>

        <div>
          <p className="text-xs font-medium text-ink-muted">Keep track</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Upcoming deadlines
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {upcomingDeadlines.map((deadline) => (
          <div key={deadline.id} className="flex gap-4">
            <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-background">
              <span className="text-xs font-semibold text-ink">
                {deadline.date.split(" ")[0]}
              </span>

              <span className="text-[10px] uppercase text-ink-muted">
                {deadline.date.split(" ")[1]}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-ink">{deadline.title}</p>

              <p className="mt-1 text-xs leading-5 text-ink-muted">
                {deadline.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingDeadlines;
