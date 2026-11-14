import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { NOTIFICATION_ROLES } from "../../config/notification.config.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/notification/notification.service.js";

const role = NOTIFICATION_ROLES.TPO;

const listTpoNotifications = asyncHandler(async (req, res) => {
  const { category, status, search } = req.query;

  const notifications = await getNotifications({
    recipient: req.user?._id,
    role,
    category,
    status,
    search,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(
        HTTP_STATUS.OK,
        notifications,
        "Notifications fetched successfully",
      ),
    );
});

const markTpoNotificationRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead({
    notificationId: req.params.notificationId,
    recipient: req.user?._id,
    role,
  });

  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, notification, "Notification marked as read"),
    );
});

const markAllTpoNotificationsRead = asyncHandler(async (req, res) => {
  await markAllNotificationsRead({ recipient: req.user?._id, role });

  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, null, "All notifications marked as read"));
});

export {
  listTpoNotifications,
  markTpoNotificationRead,
  markAllTpoNotificationsRead,
};
