import { asyncHandler, APIRES } from "../../utils/helper.utils.js";
import { HTTP_STATUS } from "../../config/httpConfig.config.js";
import {
  getStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
  deleteStudentNotification,
  getUnreadStudentNotificationCount,
} from "./studentNotification.service.js";

const getStudentId = (req) => req.user?._id;

export const getMyNotifications = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const { category = "all", status = "all", search = "" } = req.query;
  const notifications = await getStudentNotifications({
    student: studentId,
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
  const notification = await markStudentNotificationRead({
    notificationId: req.params.notificationId,
    student: studentId,
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
  await markAllStudentNotificationsRead(studentId);
  return res
    .status(HTTP_STATUS.OK)
    .json(new APIRES(HTTP_STATUS.OK, null, "All notifications marked as read"));
});

export const deleteMyNotification = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  await deleteStudentNotification({
    notificationId: req.params.notificationId,
    student: studentId,
  });
  return res
    .status(HTTP_STATUS.OK)
    .json(
      new APIRES(HTTP_STATUS.OK, null, "Notification removed successfully"),
    );
});

export const getMyUnreadNotificationCount = asyncHandler(async (req, res) => {
  const studentId = getStudentId(req);
  const count = await getUnreadStudentNotificationCount(studentId);
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
