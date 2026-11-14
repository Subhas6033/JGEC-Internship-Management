// Footer strip for a settings card: a status message on the left and the
// actions (children) on the right.
const SectionFooter = ({ message, children }) => (
  <div className="flex flex-col gap-3 border-t border-border bg-cream/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
    <p className="text-xs text-ink-muted" aria-live="polite">
      {message}
    </p>

    {children && (
      <div className="flex flex-col-reverse gap-2 sm:flex-row">{children}</div>
    )}
  </div>
);

export default SectionFooter;
