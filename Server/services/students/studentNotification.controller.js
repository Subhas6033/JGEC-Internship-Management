import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import { NOTIFICATION_ROLES as R } from "../../config/notification.config.js";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getUnreadNotificationCount,
} from "../notification/notification.service.js";

const getStudentId = (req) => req.user?._id;

export const getMyNotifications = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const { category = "all", status = "all", search = "" } = req.query;
  const notifications = await getNotifications({
    recipient: studentId,
    role: R.STUDENT,
    category,
    status,
    search,
  });
  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        notifications,
        unreadCount: notifications.filter(
          (notification) => notification.status === "unread",
        ).length,
      },
      "Student notifications fetched successfully",
    ),
  );
});

export const markMyNotificationRead = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const notification = await markNotificationRead({
    notificationId: req.params.notificationId,
    recipient: studentId,
    role: R.STUDENT,
  });
  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        notification,
      },
      "Notification marked as read",
    ),
  );
});

export const markAllMyNotificationsRead = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  await markAllNotificationsRead({ recipient: studentId, role: R.STUDENT });
  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, null, "All notifications marked as read"));
});

export const deleteMyNotification = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  await deleteNotification({
    notificationId: req.params.notificationId,
    recipient: studentId,
    role: R.STUDENT,
  });
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, null, "Notification removed successfully"),
    );
});

export const getMyUnreadNotificationCount = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const count = await getUnreadNotificationCount({
    recipient: studentId,
    role: R.STUDENT,
  });
  return res.status(HTTP_STATUS.OK).json(
    new APIRES(
      HTTP_STATUS.OK,
      {
        count,
      },
      "Unread notification count fetched successfully",
    ),
  );
});
