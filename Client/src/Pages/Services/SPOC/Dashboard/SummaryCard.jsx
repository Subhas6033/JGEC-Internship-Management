const SummaryCard = ({ icon, title, value }) => (
  <div className="rounded-xl border border-border bg-surface p-4 shadow-[--shadow-card]">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
          {title}
        </p>
        <p className="mt-1 text-xl font-bold text-ink">{value}</p>
      </div>
    </div>
  </div>
);

export default SummaryCard;
