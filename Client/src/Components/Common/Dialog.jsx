import React, { forwardRef, useEffect, useId, useRef } from "react";

import { createPortal } from "react-dom";
import { X } from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const sizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[calc(100vw-2rem)]",
};

const Dialog = forwardRef(
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
    forwardedRef,
  ) => {
    const generatedId = useId();
    const titleId = `${generatedId}-title`;
    const descriptionId = `${generatedId}-description`;

    const dialogRef = useRef(null);

    useEffect(() => {
      if (!open) return;

      const previousOverflow = document.body.style.overflow;
      const previousActiveElement = document.activeElement;

      document.body.style.overflow = "hidden";

      const frame = requestAnimationFrame(() => {
        dialogRef.current?.focus();
      });

      return () => {
        document.body.style.overflow = previousOverflow;
        cancelAnimationFrame(frame);
        previousActiveElement?.focus?.();
      };
    }, [open]);

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

    if (!open) return null;

    const handleBackdropClick = (event) => {
      if (closeOnBackdrop && event.target === event.currentTarget) {
        onClose?.();
      }
    };

    const setRefs = (node) => {
      dialogRef.current = node;

      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return createPortal(
      <div
        className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-5"
        onMouseDown={handleBackdropClick}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div
          ref={setRefs}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-describedby={description ? descriptionId : undefined}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full overflow-hidden rounded-xl",
            "border border-gray-200 bg-white shadow-2xl",
            "max-h-[90vh] overflow-y-auto outline-none",
            sizes[size] || sizes.md,
            className,
          )}
          {...props}
        >
          {(title || description || showCloseButton) && (
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-gray-200 bg-white px-5 py-4 sm:px-6">
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
                  aria-label="Close dialog"
                  className="rounded-md p-2 text-gray-500 transition hover:bg-gray-100 hover:cursor-pointer hover:text-gray-900"
                >
                  <X size={19} />
                </button>
              )}
            </div>
          )}

          <div className="px-5 py-5 sm:px-6">{children}</div>
        </div>
      </div>,
      document.body,
    );
  },
);

Dialog.displayName = "Dialog";

export default Dialog;
