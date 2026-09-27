import React, { forwardRef, useId } from "react";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Select = forwardRef(
  (
    {
      id,
      label,
      description,
      error,
      options = [],
      placeholder = "Select an option",
      className,
      containerClassName,
      required = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    const descriptionId = description ? `${selectId}-description` : undefined;

    const errorId = error ? `${selectId}-error` : undefined;

    const describedBy =
      [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
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
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={describedBy}
            className={cn(
              "block w-full appearance-none rounded-md border",
              "bg-white px-3 py-2 pr-10 text-sm",
              "text-gray-900 outline-none",
              "transition-colors duration-150",
              "cursor-pointer",
              "focus:ring-2 focus:ring-offset-0",
              "disabled:cursor-not-allowed",
              "disabled:bg-gray-100 disabled:text-gray-500",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/20",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {options.map((option) => {
              const item =
                typeof option === "string"
                  ? {
                      label: option,
                      value: option,
                    }
                  : option;

              return (
                <option
                  key={item.value}
                  value={item.value}
                  disabled={item.disabled}
                >
                  {item.label}
                </option>
              );
            })}
          </select>

          {/* Chevron */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
            aria-hidden="true"
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
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
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

Select.displayName = "Select";

export default Select;
