import { AnimatePresence } from "framer-motion";

import NotificationItem from "./NotificationItem";
import NotificationEmpty from "./NotificationEmpty";

const NotificationList = ({ notifications, onMarkRead, onDelete }) => {
  if (!notifications.length) {
    return <NotificationEmpty />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onMarkRead={onMarkRead}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationList;
