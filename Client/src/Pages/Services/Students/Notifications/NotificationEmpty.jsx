import { BellOff } from "lucide-react";

const NotificationEmpty = () => {
  return (
    <div className="flex min-h-70 flex-col items-center justify-center rounded-xl border border-dashed border-border px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BellOff size={21} />
      </div>

      <h3 className="mt-4 font-medium text-foreground">
        No notifications found
      </h3>

      <p className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
        There are no notifications matching your current search or filters.
      </p>
    </div>
  );
};

export default NotificationEmpty;
