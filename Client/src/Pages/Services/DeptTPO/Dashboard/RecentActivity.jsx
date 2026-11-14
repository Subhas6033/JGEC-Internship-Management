import {
  Building2,
  CheckCircle2,
  FileCheck2,
  XCircle,
  Clock3,
  RotateCcw,
} from "lucide-react";
import { Card } from "../../../../Components";

// Activity styles based on application status.
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
  warning: {
    wrapper: "bg-amber-50 text-amber-700",
    icon: "text-amber-700",
  },
  neutral: {
    wrapper: "bg-cream-dark text-ink-muted",
    icon: "text-ink-muted",
  },
};

// Icons based on activity type.
const iconMap = {
  success: CheckCircle2,
  danger: XCircle,
  brand: FileCheck2,
  info: Building2,
  warning: Clock3,
  neutral: RotateCcw,
};

// Map backend application statuses to UI styles.
const statusConfig = {
  submitted: {
    tone: "info",
    label: "Application submitted",
  },
  under_tpo_review: {
    tone: "warning",
    label: "Application under TPO review",
  },
  update_required: {
    tone: "warning",
    label: "Application requires an update",
  },
  approved_by_tpo: {
    tone: "success",
    label: "Application approved by TPO",
  },
  under_spoc_review: {
    tone: "info",
    label: "Application under SPOC review",
  },
  approved_by_spoc: {
    tone: "success",
    label: "Application approved by SPOC",
  },
  noc_generated: {
    tone: "success",
    label: "NOC generated",
  },
  rejected: {
    tone: "danger",
    label: "Application rejected",
  },
  withdrawn: {
    tone: "neutral",
    label: "Application withdrawn",
  },
};

// Format activity date.
const formatActivityTime = (dateValue) => {
  if (!dateValue) return "Date unavailable";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  const now = new Date();
  const diff = Math.max(0, now.getTime() - date.getTime());

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RecentActivity = ({ items = [] }) => {
  // Ensure the component always receives an array.
  const activities = Array.isArray(items) ? items : [];

  return (
    <Card className="w-full min-w-0 border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Activity</p>

            <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
              Recent activity
            </h2>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Latest application updates from your department.
            </p>
          </div>

          <span className="self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:self-auto">
            {activities.length} recent{" "}
            {activities.length === 1 ? "activity" : "activities"}
          </span>
        </div>
      </Card.Header>

      <Card.Content className="p-0">
        {!activities.length ? (
          <div className="flex min-h-40 items-center justify-center px-5 py-8 text-center">
            <div>
              <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
                <Clock3 size={18} />
              </div>

              <p className="mt-3 text-sm font-medium text-ink">
                No recent activity
              </p>

              <p className="mt-1 text-xs text-ink-muted">
                New department application updates will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {activities.map((item, index) => {
              const config = statusConfig[item?.status] ?? {
                tone: "brand",
                label: "Application updated",
              };

              const tone = config.tone;

              const styles = toneStyles[tone] ?? toneStyles.brand;
              const Icon = iconMap[tone] ?? FileCheck2;

              const title = item?.title || config.label;

              const description =
                item?.description ||
                [
                  item?.student?.fullName,
                  item?.organisation?.name,
                  item?.designation,
                ]
                  .filter(Boolean)
                  .join(" · ") ||
                "Application activity";

              // Backend returns createdAt, not time.
              const time = formatActivityTime(
                item?.createdAt ?? item?.updatedAt,
              );

              return (
                <div
                  key={
                    item?._id ?? `${item?.status}-${item?.createdAt}-${index}`
                  }
                  className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-white/50"
                >
                  <div
                    className={`
                      flex size-9 shrink-0 items-center justify-center
                      rounded-full
                      ${styles.wrapper}
                    `}
                  >
                    <Icon size={16} strokeWidth={1.8} className={styles.icon} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink">{title}</p>

                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {description}
                    </p>
                  </div>

                  <span className="shrink-0 text-[11px] text-ink-muted">
                    {time}
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
