import {
  Building2,
  CalendarDays,
  ChevronRight,
  FileCheck2,
} from "lucide-react";
import { Card } from "../../../../Components";

const iconMap = {
  company: Building2,
  review: CalendarDays,
  report: FileCheck2,
};

const UpcomingItems = ({ items = [] }) => {
  return (
    <Card className="border-border bg-cream-soft shadow-card lg:col-span-1">
      <Card.Header>
        <div>
          <p className="eyebrow">Schedule</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Upcoming
          </h2>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Important departmental dates.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="space-y-2">
        {!items.length ? (
          <div className="py-8 text-center">
            <p className="text-sm font-medium text-ink">Nothing scheduled</p>

            <p className="mt-1 text-xs text-ink-muted">
              Upcoming departmental deadlines will appear here.
            </p>
          </div>
        ) : (
          items.map((item, index) => {
            const Icon = item.icon
              ? (iconMap[item.icon] ?? CalendarDays)
              : CalendarDays;

            return (
              <button
                type="button"
                key={item._id ?? `${item.title}-${item.date}-${index}`}
                className="
                  focus-ring
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-lg
                  p-3
                  text-left
                  transition-colors
                  hover:bg-cream
                "
              >
                <div
                  className="
                    flex
                    size-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-cream-dark
                    text-ink
                  "
                >
                  <Icon size={17} strokeWidth={1.8} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {item.title}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {item.meta}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <span className="text-xs font-semibold text-brand-700">
                    {item.date}
                  </span>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                    className="text-ink-muted"
                  />
                </div>
              </button>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
};

export default UpcomingItems;
