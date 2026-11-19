import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
  deleteStudentNotification,
  getUnreadStudentNotificationCount,
} from "../Notifications/studentNotifications.api";

const studentNotificationsQueryKey = ["student-notifications"];

const useStudentNotifications = ({
  category = "all",
  status = "all",
  search = "",
} = {}) => {
  return useQuery({
    queryKey: [
      ...studentNotificationsQueryKey,
      {
        category,
        status,
        search,
      },
    ],
    queryFn: () =>
      getStudentNotifications({
        category,
        status,
        search,
      }),
  });
};

const useMarkStudentNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markStudentNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentNotificationsQueryKey,
      });
    },
  });
};

const useMarkAllStudentNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllStudentNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentNotificationsQueryKey,
      });
    },
  });
};

const useDeleteStudentNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteStudentNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentNotificationsQueryKey,
      });
    },
  });
};

const useUnreadStudentNotificationCount = () => {
  return useQuery({
    queryKey: [...studentNotificationsQueryKey, "unread-count"],
    queryFn: getUnreadStudentNotificationCount,
  });
};

export {
  useStudentNotifications,
  useMarkStudentNotificationRead,
  useMarkAllStudentNotificationsRead,
  useDeleteStudentNotification,
  useUnreadStudentNotificationCount,
};
