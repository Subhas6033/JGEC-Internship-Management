import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudentNotifications,
  markStudentNotificationRead,
  markAllStudentNotificationsRead,
  deleteStudentNotification,
  getUnreadStudentNotificationCount,
} from "../Notifications/studentNotifications.api";

export const studentNotificationsQueryKey = ["student-notifications"];

export const useStudentNotifications = ({
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

export const useMarkStudentNotificationRead = () => {
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

export const useMarkAllStudentNotificationsRead = () => {
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

export const useDeleteStudentNotification = () => {
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

export const useUnreadStudentNotificationCount = () => {
  return useQuery({
    queryKey: [...studentNotificationsQueryKey, "unread-count"],

    queryFn: getUnreadStudentNotificationCount,
  });
};
