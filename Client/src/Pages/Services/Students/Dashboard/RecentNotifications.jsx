import { ArrowRight, Bell } from "lucide-react";
import { Link } from "react-router-dom";

import { Card } from "../../../../Components/index";

const RecentNotifications = ({ notifications = [] }) => {
  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Bell size={17} strokeWidth={1.9} />
          </div>

          <div>
            <p className="text-xs font-medium text-ink-muted">Updates</p>

            <h2 className="mt-1 text-lg font-semibold text-ink">
              Recent notifications
            </h2>
          </div>
        </div>

        <Link
          to="/students/notifications"
          className="focus-ring inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View all
          <ArrowRight size={15} strokeWidth={1.9} />
        </Link>
      </div>

      <div className="mt-5 space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-white/50 px-4 py-6 text-center">
            <Bell
              size={20}
              className="mx-auto text-ink-muted"
              strokeWidth={1.7}
            />

            <p className="mt-2 text-sm font-medium text-ink">
              No recent notifications
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              New updates and important notifications will appear here.
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id || notification._id}
              className="flex items-start gap-3"
            >
              <span
                className={`mt-2 size-1.5 shrink-0 rounded-full ${
                  notification.unread ? "bg-brand-700" : "bg-border"
                }`}
              />

              <div className="min-w-0">
                <p className="text-sm leading-5 text-ink">
                  {notification.message}
                </p>

                <p className="mt-1 text-xs text-ink-muted">
                  {notification.time}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentNotifications;
