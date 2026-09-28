import React, { forwardRef, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formItemAnimation, transitions } from "../../Animations/animations";
const cn = (...classes) => classes.filter(Boolean).join(" ");

const Input = forwardRef(
  (
    {
      id,
      label,
      description,
      error,
      className,
      containerClassName,
      startIcon,
      startAddon,
      endIcon,
      required = false,
      disabled = false,
      animate = true,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const shouldReduceMotion = useReducedMotion();

    const descriptionId = description ? `${inputId}-description` : undefined;

    const errorId = error ? `${inputId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    const hasStartAddon = Boolean(startAddon);
    const hasStartIcon = Boolean(startIcon);

    const animationProps =
      animate && !shouldReduceMotion
        ? {
            variants: formItemAnimation,
            initial: "hidden",
            animate: "visible",
          }
        : {};

    return (
      <motion.div
        {...animationProps}
        className={cn("w-full min-w-0", containerClassName)}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-gray-900"
          >
            {label}

            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative min-w-0">
          {hasStartAddon && (
            <div
              className="
                pointer-events-none
                absolute inset-y-0 left-0 z-10
                flex items-center
              "
              aria-hidden="true"
            >
              <div
                className="
                  flex h-full items-center
                  border-r border-border
                  px-3
                  text-xs font-semibold
                  text-ink-muted
                "
              >
                {startAddon}
              </div>
            </div>
          )}

          {hasStartIcon && (
            <div
              className={cn(
                `
                  pointer-events-none
                  absolute inset-y-0 z-10
                  flex items-center
                  text-gray-400
                `,
                hasStartAddon ? "left-17" : "left-0 pl-3",
              )}
              aria-hidden="true"
            >
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={describedBy}
            className={cn(
              `
                block w-full min-w-0
                rounded-md border
                bg-white
                px-3 py-2
                text-sm text-gray-900
                placeholder:text-gray-400
                outline-none
                transition-[border-color,box-shadow,background-color]
                duration-150
                focus:ring-2
                focus:ring-offset-0
                disabled:cursor-not-allowed
                disabled:bg-gray-100
                disabled:text-gray-500
              `,
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
              hasStartAddon
                ? hasStartIcon
                  ? "pl-27"
                  : "pl-18"
                : hasStartIcon
                  ? "pl-10"
                  : "",
              endIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {endIcon && (
            <div
              className="
                absolute inset-y-0 right-0
                flex items-center pr-3
              "
            >
              {endIcon}
            </div>
          )}
        </div>

        <motion.div layout transition={transitions.fast}>
          {description && !error && (
            <p id={descriptionId} className="mt-1.5 text-sm text-gray-500">
              {description}
            </p>
          )}

          {error && (
            <motion.p
              id={errorId}
              role="alert"
              initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -2 }}
              transition={transitions.fast}
              className="mt-1.5 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    );
  },
);

Input.displayName = "Input";

export default Input;
