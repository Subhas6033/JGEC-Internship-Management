import {
  NOTIFICATION_ROLES as R,
  NOTIFICATION_TYPES as T,
} from "../../config/notification.config.js";
import {
  createNotification,
  publishEvent,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "../notification/notification.service.js";

const toActor = (actor, actorRole) =>
  actor ? { id: actor, role: actorRole } : null;

export const createStudentNotification = ({
  student,
  application = null,
  actor = null,
  actorRole = null,
  type,
  title,
  message,
  metadata = {},
}) =>
  createNotification({
    role: R.STUDENT,
    recipient: student,
    application,
    actor: toActor(actor, actorRole),
    type,
    title,
    message,
    metadata,
  });

export const createApplicationNotification = ({
  application,
  student,
  actor = null,
  actorRole = null,
  type,
  context = {},
}) =>
  publishEvent({
    type,
    application,
    actor: toActor(actor, actorRole),
    recipientIds: [student],
    context,
  });

export const createNOCNotification = ({
  application,
  student,
  actor = null,
  actorRole = null,
  context = {},
}) =>
  publishEvent({
    type: T.NOC_GENERATED,
    application,
    actor: toActor(actor, actorRole),
    recipientIds: [student],
    context,
  });

export const getStudentNotifications = ({ student, ...filters }) =>
  getNotifications({ recipient: student, role: R.STUDENT, ...filters });

export const markStudentNotificationRead = ({ notificationId, student }) =>
  markNotificationRead({ notificationId, recipient: student, role: R.STUDENT });

export const markAllStudentNotificationsRead = (student) =>
  markAllNotificationsRead({ recipient: student, role: R.STUDENT });

export const deleteStudentNotification = ({ notificationId, student }) =>
  deleteNotification({ notificationId, recipient: student, role: R.STUDENT });

export const getUnreadStudentNotificationCount = (student) =>
  getUnreadNotificationCount({ recipient: student, role: R.STUDENT });
