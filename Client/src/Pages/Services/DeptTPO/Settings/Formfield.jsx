// Labelled input with optional prefix (e.g. +91), error and hint.
// Extra props (type, value, onChange, autoComplete...) go to the <input>.
const FormField = ({
  id,
  label,
  error,
  hint,
  prefix,
  required = false,
  className = "",
  ...inputProps
}) => (
  <div className={className}>
    <label htmlFor={id} className="text-sm font-medium text-ink">
      {label}
      {required && (
        <span className="ml-0.5 text-red-600" aria-hidden="true">
          *
        </span>
      )}
    </label>

    <div
      className={`mt-1.5 flex items-stretch overflow-hidden rounded-lg border bg-cream transition-colors focus-within:ring-2 ${
        error
          ? "border-red-400 focus-within:ring-red-200"
          : "border-border focus-within:border-brand-700 focus-within:ring-brand-700/20"
      }`}
    >
      {prefix && (
        <span className="flex select-none items-center border-r border-border bg-cream-dark/50 px-3 text-sm text-ink-muted">
          {prefix}
        </span>
      )}

      <input
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${id}-error` : hint ? `${id}-hint` : undefined
        }
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted"
        {...inputProps}
      />
    </div>

    {error ? (
      <p id={`${id}-error`} className="mt-1.5 text-xs text-red-700">
        {error}
      </p>
    ) : (
      hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-muted">
          {hint}
        </p>
      )
    )}
  </div>
);

export default FormField;
