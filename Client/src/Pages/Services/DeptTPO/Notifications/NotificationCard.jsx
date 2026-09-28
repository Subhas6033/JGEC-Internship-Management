import {
  Bell,
  Building2,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Info,
} from "lucide-react";

const notificationConfig = {
  application: {
    icon: Bell,
    iconClass: "bg-brand-700 text-white",
  },

  deadline: {
    icon: Clock3,
    iconClass: "bg-amber-100 text-amber-700",
  },

  approval: {
    icon: CheckCircle2,
    iconClass: "bg-emerald-100 text-emerald-700",
  },

  tpo: {
    icon: FileCheck2,
    iconClass: "bg-blue-100 text-blue-700",
  },

  system: {
    icon: Info,
    iconClass: "bg-cream-dark text-ink-muted",
  },
};

const NotificationCard = ({ notification, onClick, onMarkAsRead }) => {
  /*
   * Defensive guard.
   *
   * This prevents:
   * Cannot read properties of undefined (reading 'type')
   */
  if (!notification || typeof notification !== "object") {
    return null;
  }

  const config =
    notificationConfig[notification.type] ?? notificationConfig.system;

  const Icon = config.icon;

  return (
    <article
      className={[
        "group relative rounded-xl border bg-white p-4 transition sm:p-5",
        notification.read
          ? "border-border"
          : "border-brand-200 bg-brand-50/40 shadow-card",
        "hover:border-brand-200 hover:shadow-card-hover",
      ].join(" ")}
    >
      {!notification.read && (
        <span
          className="absolute right-4 top-5 size-2 rounded-full bg-brand-700"
          aria-label="Unread notification"
        />
      )}

      <div className="flex gap-3.5">
        <div
          className={[
            "flex size-10 shrink-0 items-center justify-center rounded-xl",
            config.iconClass,
          ].join(" ")}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1 pr-3">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h3 className="text-sm font-semibold text-ink">
              {notification.title}
            </h3>

            <time className="shrink-0 text-xs text-ink-muted">
              {notification.time}
            </time>
          </div>

          <p className="mt-1.5 text-sm leading-6 text-ink-muted">
            {notification.message}
          </p>

          {(notification.company || notification.applicationCount) && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {notification.company && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-cream-soft px-2 py-1 text-xs font-medium text-ink">
                  <Building2 size={13} strokeWidth={1.8} />

                  {notification.company}
                </span>
              )}

              {notification.applicationCount && (
                <span className="inline-flex items-center gap-1.5 rounded-md bg-cream-soft px-2 py-1 text-xs text-ink-muted">
                  {notification.applicationCount}{" "}
                  {notification.applicationCount === 1
                    ? "application"
                    : "applications"}
                </span>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onClick?.(notification)}
              className="text-xs font-medium text-brand-700 transition hover:text-brand-800 hover:underline focus:outline-none"
            >
              View details
            </button>

            {!notification.read && (
              <>
                <span className="size-1 rounded-full bg-border" />

                <button
                  type="button"
                  onClick={() => onMarkAsRead?.(notification.id)}
                  className="text-xs font-medium text-ink-muted transition hover:text-ink hover:underline focus:outline-none"
                >
                  Mark as read
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default NotificationCard;
