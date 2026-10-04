import { useEffect } from "react";
const cn = (...classes) => classes.filter(Boolean).join(" ");

const variants = {
  success: {
    container: "border-green-200 bg-green-50 text-green-900",
    icon: "text-green-600",
  },
  error: {
    container: "border-red-200 bg-red-50 text-red-900",
    icon: "text-red-600",
  },
  warning: {
    container: "border-yellow-200 bg-yellow-50 text-yellow-900",
    icon: "text-yellow-600",
  },
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-900",
    icon: "text-blue-600",
  },
};

const icons = {
  success: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 12 2 2 4-4" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),

  error: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9 9 15" />
      <path d="m9 9 6 6" />
    </svg>
  ),

  warning: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.6 2.5 17a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
    </svg>
  ),

  info: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </svg>
  ),
};

const Toast = ({
  title,
  message,
  variant = "info",
  duration = 5000,
  onClose,
  action,
  className,
}) => {
  const currentVariant = variants[variant] || variants.info;

  useEffect(() => {
    if (!duration || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "pointer-events-auto w-full max-w-sm rounded-lg border",
        "p-4 shadow-lg",
        "transition-all duration-200",
        currentVariant.container,
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn("mt-0.5 h-5 w-5 shrink-0", currentVariant.icon)}>
          {icons[variant]}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {message && (
            <p className={cn("text-sm", title && "mt-1", "opacity-90")}>
              {message}
            </p>
          )}
          {/* Action */}
          {action && <div className="mt-3">{action}</div>}
        </div>
        {/* Close */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification"
            className={cn(
              "shrink-0 rounded-md p-1",
              "cursor-pointer opacity-70",
              "transition-opacity hover:opacity-100",
              "focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-current",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
