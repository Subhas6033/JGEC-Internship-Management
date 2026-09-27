import { useMemo, useState } from "react";
import { Bell, CheckCheck, Inbox, MailOpen } from "lucide-react";
import { motion } from "framer-motion";

import { Button, Card } from "../../../../Components";

import NotificationFilters from "./NotificationFilters";
import NotificationList from "./NotificationList";

import { notificationsData } from "./notifications.data";

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState(notificationsData);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const unreadCount = useMemo(
    () =>
      notifications.filter((notification) => notification.status === "unread")
        .length,
    [notifications],
  );

  const readCount = notifications.length - unreadCount;

  const filteredNotifications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return notifications
      .filter((notification) => {
        if (
          normalizedSearch &&
          !notification.title.toLowerCase().includes(normalizedSearch) &&
          !notification.message.toLowerCase().includes(normalizedSearch)
        ) {
          return false;
        }

        if (category !== "all" && notification.category !== category) {
          return false;
        }

        if (status !== "all" && notification.status !== status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, search, category, status]);

  const handleMarkRead = (id) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              status: "read",
            }
          : notification,
      ),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        status: "read",
      })),
    );
  };

  const handleDelete = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    );
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  return (
    <>
      <title>Notifications | JGEC Internship Portal</title>

      <meta
        name="description"
        content="View important internship application, verification, document, and portal notifications through the JGEC Internship Portal."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#ffffff" />

      <meta
        property="og:title"
        content="Notifications | JGEC Internship Portal"
      />

      <meta
        property="og:description"
        content="Stay updated with your internship applications, verification progress, documents, and other important activities."
      />

      <meta property="og:type" content="website" />
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-sm text-primary">
                <Bell size={17} />
                <span>Student Notifications</span>
              </div>

              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Notifications
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Stay updated with your internship applications, verification
                progress, documents, and other important activities.
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleMarkAllRead}
                className="inline-flex w-fit items-center gap-2 whitespace-nowrap"
              >
                <CheckCheck size={16} />
                <span>Mark all as read</span>
              </Button>
            )}
          </motion.div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Inbox size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Total notifications
                  </p>

                  <p className="text-xl font-semibold text-foreground">
                    {notifications.length}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Bell size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Unread</p>

                  <p className="text-xl font-semibold text-foreground">
                    {unreadCount}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                  <MailOpen size={19} />
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Read</p>

                  <p className="text-xl font-semibold text-foreground">
                    {readCount}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <Card className="p-4">
            <div className="mb-4">
              <h2 className="font-semibold text-foreground">
                Find notifications
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Search or filter your notification history.
              </p>
            </div>

            <NotificationFilters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              status={status}
              setStatus={setStatus}
              onReset={handleReset}
            />
          </Card>

          {/* Notification list */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  Recent notifications
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Showing {filteredNotifications.length} of{" "}
                  {notifications.length} notifications
                </p>
              </div>
            </div>

            <NotificationList
              notifications={filteredNotifications}
              onMarkRead={handleMarkRead}
              onDelete={handleDelete}
            />
          </section>
        </div>
      </main>
    </>
  );
};

export default StudentNotifications;
