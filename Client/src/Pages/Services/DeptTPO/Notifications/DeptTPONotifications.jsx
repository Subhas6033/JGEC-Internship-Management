import { useMemo, useState } from "react";
import { Bell, CheckCheck, Filter, Inbox, Search, XCircle } from "lucide-react";

import { Button, Card, Input } from "../../../../Components";
import NotificationCard from "./NotificationCard";
import {
  useTpoNotifications,
  useMarkTpoNotificationRead,
  useMarkAllTpoNotificationsRead,
} from "../../../../Services/Queries/tpoNotification.uires.js";

import {
  notificationTypes,
  toNotificationView,
} from "../../../../Utils/notification.utils.js";

const DeptTPONotifications = () => {
  const { data, isLoading, isError, error, refetch } = useTpoNotifications();
  const markRead = useMarkTpoNotificationRead();
  const markAllRead = useMarkAllTpoNotificationsRead();

  const notifications = useMemo(
    () => (data ?? []).map(toNotificationView),
    [data],
  );

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
    markRead.mutate(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllRead.mutate();
  };

  const handleNotificationClick = (notification) => {
    const openApplication = () => {
      if (notification.applicationId) {
        window.location.assign(
          `/depttpo/applications/${notification.applicationId}`,
        );
      }
    };

    if (notification.read) {
      openApplication();
      return;
    }

    markRead.mutate(notification.id, { onSettled: openApplication });
  };

  return (
    <>
      <title>Notifications | Department TPO | Internship NOC</title>
      <meta
        name="description"
        content="Updates on student internship applications, including new submissions, status changes, and items that need your review."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta property="og:title" content="Notifications | Department TPO" />
      <meta
        property="og:description"
        content="Updates on student internship applications and items that need your review."
      />

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
                disabled={markAllRead.isPending}
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
                    {isLoading ? "–" : notifications.length}
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
                    {isLoading ? "–" : unreadCount}
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
                  <option value={notificationTypes.VERIFICATION}>
                    Verification
                  </option>
                  <option value={notificationTypes.DOCUMENT}>Documents</option>
                  <option value={notificationTypes.INTERNSHIP}>
                    Internships
                  </option>
                  <option value={notificationTypes.SYSTEM}>System</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          {isLoading ? (
            <div
              className="space-y-3"
              role="status"
              aria-label="Loading notifications"
            >
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl border border-border bg-cream-soft"
                />
              ))}
              <span className="sr-only">Loading notifications…</span>
            </div>
          ) : isError ? (
            <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div role="alert" className="flex flex-col items-center">
                <XCircle className="h-10 w-10 text-red-600" />

                <h2 className="mt-4 text-base font-semibold text-ink">
                  Unable to load notifications
                </h2>

                <p className="mt-1 max-w-md text-sm text-ink-muted">
                  {error?.message ||
                    "Something went wrong while loading notifications."}
                </p>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={() => refetch()}
                >
                  Try again
                </Button>
              </div>
            </Card>
          ) : filteredNotifications.length > 0 ? (
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
                {notifications.length === 0
                  ? "You have no notifications yet."
                  : "Try changing your search or notification filter."}
              </p>
            </Card>
          )}
        </div>
      </section>
    </>
  );
};

export default DeptTPONotifications;
