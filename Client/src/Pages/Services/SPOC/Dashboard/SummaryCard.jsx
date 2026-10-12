const SummaryCard = ({ icon, title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {title}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

export default SummaryCard;
