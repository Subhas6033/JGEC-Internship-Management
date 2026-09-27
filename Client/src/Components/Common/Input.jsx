import React, { forwardRef, useId } from "react";

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
      endIcon,
      required = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const descriptionId = description ? `${inputId}-description` : undefined;

    const errorId = error ? `${inputId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
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

        <div className="relative">
          {startIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"
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
              "block w-full rounded-md border bg-white px-3 py-2",
              "text-sm text-gray-900 placeholder:text-gray-400",
              "outline-none transition-colors duration-150",
              "focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed disabled:bg-gray-100",
              "disabled:text-gray-500",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
              startIcon && "pl-10",
              endIcon && "pr-10",
              className,
            )}
            {...props}
          />

          {endIcon && (
            <div
              className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"
              aria-hidden="true"
            >
              {endIcon}
            </div>
          )}
        </div>

        {description && !error && (
          <p id={descriptionId} className="mt-1.5 text-sm text-gray-500">
            {description}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
