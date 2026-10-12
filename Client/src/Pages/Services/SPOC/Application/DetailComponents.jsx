import { Card } from "../../../../Components/index";

export const DetailsCard = ({
  icon,
  title,
  description,
  children,
  className = "",
}) => (
  <Card
    className={`border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
  >
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
    {children}
  </Card>
);

export const DetailItem = ({ icon, label, value }) => (
  <div className="min-w-0">
    <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
      {icon}
      {label}
    </p>
    <p className="wrap-break-word text-sm font-medium leading-6 text-slate-800">
      {value ?? "—"}
    </p>
  </div>
);

export const InfoBox = ({ label, value, className = "" }) => (
  <div
    className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${className}`}
  >
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="mt-1.5 wrap-break-word text-sm font-medium text-slate-800">
      {value || "—"}
    </p>
  </div>
);

export const PeriodRow = ({ label, value, icon }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-3">
    <span className="mt-0.5 text-emerald-700">{icon}</span>
    <div>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  </div>
);

export const SummaryCard = ({ icon, title, value }) => (
  <Card className="flex min-w-0 items-center gap-4 border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-slate-800">
        {value || "—"}
      </p>
    </div>
  </Card>
);

export const StatusBadge = ({ status, label }) => {
  const classes = {
    approved_by_tpo: "border-amber-200 bg-amber-50 text-amber-700",
    under_spoc_review: "border-amber-200 bg-amber-50 text-amber-700",
    approved_by_spoc: "border-emerald-200 bg-emerald-50 text-emerald-700",
    noc_generated: "border-emerald-200 bg-emerald-50 text-emerald-700",
    rejected: "border-red-200 bg-red-50 text-red-700",
    update_required: "border-orange-200 bg-orange-50 text-orange-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        classes[status] || "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {label || status || "Unknown"}
    </span>
  );
};
