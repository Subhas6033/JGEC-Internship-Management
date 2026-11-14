// Replaces notification.data.js. The values mirror NOTIFICATION_CATEGORIES
// in the backend (config/notification.config.js).
export const notificationTypes = Object.freeze({
  APPLICATION: "application",
  VERIFICATION: "verification",
  DOCUMENT: "document",
  INTERNSHIP: "internship",
  SYSTEM: "system",
});

const knownTypes = new Set(Object.values(notificationTypes));

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormatter.format(date);
};

const formatTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return formatDate(date);
};

/**
 * Converts a backend Notification document into the shape that
 * DeptTPONotifications and NotificationCard already use.
 */
export const toNotificationView = (notification) => ({
  id: String(notification._id),
  type: knownTypes.has(notification.category)
    ? notification.category
    : notificationTypes.SYSTEM,
  title: notification.title,
  message: notification.message,
  read: notification.status === "read",
  time: formatTime(notification.createdAt),
  date: formatDate(notification.createdAt),
  company: notification.metadata?.organisationName,
  applicationCount: notification.metadata?.count,
  applicationId:
    notification.application?._id ?? notification.application ?? null,
});
