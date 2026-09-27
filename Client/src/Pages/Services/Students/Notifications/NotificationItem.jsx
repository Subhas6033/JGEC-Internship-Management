import { Bell, Check, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "../../../../Components";
import NotificationBadge from "./NotificationBadge";

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const isUnread = notification.status === "unread";

  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(notification.createdAt));

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={`group relative rounded-xl border p-4 transition-colors ${
        isUnread
          ? "border-primary/20 bg-primary/[0.03]"
          : "border-border bg-card"
      }`}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            isUnread
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          <Bell size={18} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-sm ${
                    isUnread
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground"
                  }`}
                >
                  {notification.title}
                </h3>

                <NotificationBadge category={notification.category} />

                {isUnread && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>

              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {notification.message}
              </p>
            </div>

            <span className="shrink-0 text-xs text-muted-foreground">
              {formattedDate}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {isUnread && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onMarkRead(notification.id)}
                className="inline-flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Mark as read</span>
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onDelete(notification.id)}
              className="inline-flex items-center gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default NotificationItem;
