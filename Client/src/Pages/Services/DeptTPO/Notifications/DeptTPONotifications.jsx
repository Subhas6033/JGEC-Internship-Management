import { useMemo, useState } from "react";
import { Bell, CheckCheck, Filter, Inbox, Search } from "lucide-react";

import { Button, Card, Input } from "../../../../Components";
import NotificationCard from "./NotificationCard";

import {
  notifications as initialNotifications,
  notificationTypes,
} from "./notification.data";

const DeptTPONotifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((notification) => {
      if (!notification || typeof notification !== "object") {
        return false;
      }

      const matchesFilter = filter === "all" || notification.type === filter;

      if (!query) {
        return matchesFilter;
      }

      const searchableContent = [
        notification.title,
        notification.message,
        notification.company,
        notification.date,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesFilter && searchableContent.includes(query);
    });
  }, [notifications, search, filter]);

  const handleMarkAsRead = (notificationId) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification:", notification);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Department TPO</span>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              Stay updated with internship applications, deadlines, approvals,
              and central TPO activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              type="button"
              variant="secondary"
              onClick={handleMarkAllAsRead}
              className="w-full sm:w-auto"
            >
              <CheckCheck size={16} />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-700 text-white">
                <Bell size={18} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Total notifications
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {notifications.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                <Inbox size={18} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Unread
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  {unreadCount}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="flex-1">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="shrink-0 text-ink-muted" />

              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className="h-10 rounded-lg border border-border bg-white px-3 text-sm text-ink outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              >
                <option value="all">All notifications</option>
                <option value={notificationTypes.APPLICATION}>
                  Applications
                </option>
                <option value={notificationTypes.DEADLINE}>Deadlines</option>
                <option value={notificationTypes.APPROVAL}>Approvals</option>
                <option value={notificationTypes.TPO}>Central TPO</option>
                <option value={notificationTypes.SYSTEM}>System</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
              <Search size={20} />
            </div>

            <h2 className="mt-4 text-base font-semibold text-ink">
              No notifications found
            </h2>

            <p className="mt-1 max-w-md text-sm text-ink-muted">
              Try changing your search or notification filter.
            </p>
          </Card>
        )}
      </div>
    </section>
  );
};

export default DeptTPONotifications;
