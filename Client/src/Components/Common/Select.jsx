const Select = ({
  label,
  error,
  options = [],
  className = "",
  placeholder = "Select your department",
  required = false,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-ink">
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
          {...props}
          required={required}
          className={`
            block
            h-12
            w-full
            appearance-none
            rounded-lg
            border
            border-border
            bg-cream-soft
            px-3
            pr-10
            text-sm
            leading-none
            text-ink
            outline-none
            transition-all
            focus:border-brand-600
            focus:ring-2
            focus:ring-brand-600/15
            disabled:cursor-not-allowed
            disabled:opacity-60
            ${className}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <svg
          className="
            pointer-events-none
            absolute
            right-3
            top-1/2
            size-4.5
            -translate-y-1/2
            text-ink-muted
          "
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

      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
