import { useEffect, useRef } from "react";

const SelectCheckbox = ({
  checked,
  indeterminate = false,
  disabled = false,
  onChange,
  label,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label className="group relative flex items-center justify-center">
      <input
        ref={ref}
        type="checkbox"
        aria-label={label}
        aria-checked={checked || indeterminate ? "true" : "false"}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        className="peer sr-only"
      />
      <div
        aria-hidden="true"
        className={`
          size-4.5 rounded border transition-all duration-200 ease-in-out
          ${
            disabled
              ? "cursor-not-allowed border-gray-300 bg-gray-50"
              : checked
                ? "border-brand-600 bg-brand-600"
                : indeterminate
                  ? "border-brand-600 bg-brand-100"
                  : "border-gray-300 bg-white group-hover:border-brand-400 group-hover:bg-brand-50"
          }
          focus-within:ring-2 focus-within:ring-brand-600/20 focus-within:outline-none
        `}
      >
        {checked && (
          <svg
            className="pointer-events-none size-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        )}
        {!checked && indeterminate && (
          <svg
            className="pointer-events-none size-3.5 text-brand-700"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
          </svg>
        )}
      </div>
    </label>
  );
};

export default SelectCheckbox;
