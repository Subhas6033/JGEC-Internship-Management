import React, { forwardRef, useEffect, useId, useRef } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Modal = forwardRef(
  (
    {
      open = false,
      onClose,
      children,
      title,
      description,
      size = "md",
      closeOnBackdrop = true,
      closeOnEscape = true,
      showCloseButton = true,
      className,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const titleId = `${generatedId}-title`;
    const descriptionId = `${generatedId}-description`;
    const modalRef = useRef(null);

    // Lock body scroll while modal is open
    useEffect(() => {
      if (!open) return;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }, [open]);

    // Close with Escape
    useEffect(() => {
      if (!open || !closeOnEscape) return;

      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onClose?.();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [open, closeOnEscape, onClose]);

    // Focus modal when opened
    useEffect(() => {
      if (!open) return;

      const timer = setTimeout(() => {
        modalRef.current?.focus();
      }, 0);

      return () => clearTimeout(timer);
    }, [open]);

    if (!open) return null;

    const sizes = {
      sm: "max-w-sm",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
      full: "max-w-[calc(100vw-2rem)]",
    };

    const handleBackdropClick = (event) => {
      if (closeOnBackdrop && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="presentation"
        onMouseDown={handleBackdropClick}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        {/* Modal */}
        <div
          ref={(node) => {
            modalRef.current = node;

            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full overflow-hidden rounded-xl",
            "border border-gray-200 bg-white shadow-2xl",
            "outline-none",
            sizes[size] || sizes.md,
            className,
          )}
          {...props}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-4">
              <div className="min-w-0">
                {title && (
                  <h2
                    id={titleId}
                    className="text-lg font-semibold text-gray-900"
                  >
                    {title}
                  </h2>
                )}

                {description && (
                  <p id={descriptionId} className="mt-1 text-sm text-gray-500">
                    {description}
                  </p>
                )}
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close modal"
                  className={cn(
                    "shrink-0 rounded-md p-2 text-gray-500",
                    "cursor-pointer transition-colors",
                    "hover:bg-gray-100 hover:text-gray-900",
                    "focus-visible:outline-none",
                    "focus-visible:ring-2 focus-visible:ring-blue-500",
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
          )}

          {/* Content */}
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
