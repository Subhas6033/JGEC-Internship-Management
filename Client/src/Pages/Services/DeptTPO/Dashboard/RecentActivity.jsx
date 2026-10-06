import { Building2, CheckCircle2, FileCheck2, XCircle } from "lucide-react";
import { Button, Card } from "../../../../Components";

const toneStyles = {
  success: {
    wrapper: "bg-brand-50 text-success",
    icon: "text-success",
  },

  danger: {
    wrapper: "bg-red-50 text-danger",
    icon: "text-danger",
  },

  brand: {
    wrapper: "bg-brand-50 text-brand-700",
    icon: "text-brand-700",
  },

  info: {
    wrapper: "bg-sky-50 text-info",
    icon: "text-info",
  },
};

const iconMap = {
  success: CheckCircle2,
  danger: XCircle,
  brand: FileCheck2,
  info: Building2,
};

const RecentActivity = ({ items = [] }) => {
  return (
    <Card className="border-border bg-cream-soft shadow-card lg:col-span-2">
      <Card.Header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Activity</p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
              Recent activity
            </h2>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Latest updates from your department.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="
              self-start
              text-brand-700
              hover:bg-brand-50
              hover:text-brand-800
              sm:self-auto
            "
          >
            Activity log
          </Button>
        </div>
      </Card.Header>

      <Card.Content className="p-0">
        {!items.length ? (
          <div className="flex min-h-40 items-center justify-center px-5 py-8 text-center">
            <div>
              <p className="text-sm font-medium text-ink">No recent activity</p>

              <p className="mt-1 text-xs text-ink-muted">
                Department activity will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item, index) => {
              const tone = toneStyles[item.tone] ?? toneStyles.brand;

              const Icon = iconMap[item.tone] ?? FileCheck2;

              return (
                <div
                  key={item._id ?? `${item.title}-${item.time}-${index}`}
                  className="
                    flex
                    items-center
                    gap-3
                    px-5
                    py-4
                  "
                >
                  <div
                    className={`
                      flex
                      size-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${tone.wrapper}
                    `}
                  >
                    <Icon size={16} strokeWidth={1.8} className={tone.icon} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{item.title}</p>

                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {item.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] text-ink-muted">
                    {item.time}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default RecentActivity;
