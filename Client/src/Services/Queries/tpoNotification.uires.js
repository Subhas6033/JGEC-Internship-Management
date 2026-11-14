import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "../api/apiClient";

const BASE = "/tpo/notifications";
const KEY = ["tpo-notifications"];

const fetchNotifications = async () => {
  const { data } = await api.get(BASE);
  const list = data?.data ?? data;
  return Array.isArray(list) ? list : [];
};

export const useTpoNotifications = () =>
  useQuery({
    queryKey: KEY,
    queryFn: fetchNotifications,
    refetchInterval: 30_000,
  });

// Marks items as read in the cache straight away, then re-syncs with the server.
const useReadMutation = (request, applyRead) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: request,
    onMutate: async (arg) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const previous = queryClient.getQueryData(KEY);

      queryClient.setQueryData(KEY, (current = []) =>
        current.map((notification) => applyRead(notification, arg)),
      );

      return { previous };
    },
    onError: (_error, _arg, context) => {
      if (context?.previous) queryClient.setQueryData(KEY, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
};

export const useMarkTpoNotificationRead = () =>
  useReadMutation(
    (notificationId) => api.patch(`${BASE}/${notificationId}/read`),
    (notification, notificationId) =>
      String(notification._id) === String(notificationId)
        ? { ...notification, status: "read" }
        : notification,
  );

export const useMarkAllTpoNotificationsRead = () =>
  useReadMutation(
    () => api.patch(`${BASE}/read-all`),
    (notification) => ({ ...notification, status: "read" }),
  );
