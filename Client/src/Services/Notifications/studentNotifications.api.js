import { apiClient } from "../api/apiClient";
const STUDENT_NOTIFICATIONS_ENDPOINT = "/student/notifications";

export const getStudentNotifications = async ({
  category = "all",
  status = "all",
  search = "",
} = {}) => {
  const response = await apiClient.get(STUDENT_NOTIFICATIONS_ENDPOINT, {
    params: {
      category,
      status,
      search,
    },
  });

  return response?.data ?? response;
};

export const markStudentNotificationRead = async (notificationId) => {
  const response = await apiClient.patch(
    `${STUDENT_NOTIFICATIONS_ENDPOINT}/${notificationId}/read`,
  );

  return response?.data ?? response;
};

export const markAllStudentNotificationsRead = async () => {
  const response = await apiClient.patch(
    `${STUDENT_NOTIFICATIONS_ENDPOINT}/read-all`,
  );

  return response?.data ?? response;
};

export const deleteStudentNotification = async (notificationId) => {
  const response = await apiClient.delete(
    `${STUDENT_NOTIFICATIONS_ENDPOINT}/${notificationId}`,
  );

  return response?.data ?? response;
};

export const getUnreadStudentNotificationCount = async () => {
  const response = await apiClient.get(
    `${STUDENT_NOTIFICATIONS_ENDPOINT}/unread-count`,
  );

  return response?.data ?? response;
};
