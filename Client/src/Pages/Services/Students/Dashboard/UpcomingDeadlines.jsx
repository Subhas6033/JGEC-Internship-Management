import { CalendarClock } from "lucide-react";

import { Card } from "../../../../Components/index";

const UpcomingDeadlines = ({ deadlines = [] }) => {
  const formatDeadlineDate = (date) => {
    if (!date) {
      return {
        day: "—",
        month: "",
      };
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return {
        day: "—",
        month: "",
      };
    }

    return {
      day: parsedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
      }),
      month: parsedDate.toLocaleDateString("en-IN", {
        month: "short",
      }),
    };
  };

  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-dark text-ink">
          <CalendarClock size={17} strokeWidth={1.9} />
        </div>

        <div>
          <p className="text-xs font-medium text-ink-muted">Keep track</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Upcoming deadlines
          </h2>
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {deadlines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white/50 px-4 py-6 text-center">
            <CalendarClock
              size={20}
              className="mx-auto text-ink-muted"
              strokeWidth={1.7}
            />

            <p className="mt-2 text-sm font-medium text-ink">
              No upcoming deadlines
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Upcoming deadlines will appear here when they are available.
            </p>
          </div>
        ) : (
          deadlines.map((deadline) => {
            const formattedDate = formatDeadlineDate(deadline.date);

            return (
              <div key={deadline.id || deadline._id} className="flex gap-4">
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg border border-border bg-background">
                  <span className="text-xs font-semibold text-ink">
                    {formattedDate.day}
                  </span>

                  <span className="text-[10px] uppercase text-ink-muted">
                    {formattedDate.month}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink">
                    {deadline.title}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-ink-muted">
                    {deadline.description}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};

export default UpcomingDeadlines;
