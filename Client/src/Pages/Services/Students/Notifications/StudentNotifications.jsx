import { useMemo, useState } from "react";
import { Bell, CheckCheck, Inbox, MailOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components";
import NotificationFilters from "./NotificationFilters";
import NotificationList from "./NotificationList";
import {
  useStudentNotifications,
  useMarkStudentNotificationRead,
  useMarkAllStudentNotificationsRead,
  useDeleteStudentNotification,
} from "../../../../Services/Queries/studentNotifications.queries";

const StudentNotifications = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const { data, isLoading, isError, error } = useStudentNotifications({
    category,
    status,
    search,
  });

  const markReadMutation = useMarkStudentNotificationRead();
  const markAllReadMutation = useMarkAllStudentNotificationsRead();
  const deleteMutation = useDeleteStudentNotification();
  const notificationsData = data?.data ?? data ?? {};
  const notifications = notificationsData?.notifications ?? [];
  const unreadCount = notifications.filter(
    (notification) => notification.status === "unread",
  ).length;
  const readCount = notifications.length - unreadCount;

  const handleMarkRead = (id) => {
    markReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-75 max-w-7xl items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading notifications...
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="border-destructive/20 p-6">
            <h2 className="font-semibold text-foreground">
              Unable to load notifications
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              {error?.message ||
                "Something went wrong while loading your notifications."}
            </p>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <>
      <title>Notifications | JGEC Internship Portal</title>
      <meta
        name="description"
        content="View important internship application, verification, document, and portal notifications through the JGEC Internship Portal."
      />
      <meta name="robots" content="noindex, nofollow" />
      <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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
                disabled={markAllReadMutation.isPending}
                className="inline-flex w-fit items-center gap-2 whitespace-nowrap"
              >
                <CheckCheck size={16} />

                <span>
                  {markAllReadMutation.isPending
                    ? "Marking..."
                    : "Mark all as read"}
                </span>
              </Button>
            )}
          </motion.div>

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

          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-foreground">
                  Recent notifications
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  Showing {notifications.length} notifications
                </p>
              </div>
            </div>

            <NotificationList
              notifications={notifications}
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
