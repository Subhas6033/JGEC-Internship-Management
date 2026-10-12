import { CheckCircle2, Clock3 } from "lucide-react";
import { DetailsCard, StatusBadge } from "./DetailComponents";

export default function ApplicationStatus({
  status,
  statusLabel,
  createdAt,
  updatedAt,
}) {
  return (
    <DetailsCard
      icon={<Clock3 size={20} />}
      title="Application Status"
      description="Current state of the application."
    >
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={status} label={statusLabel} />
        {status === "approved_by_spoc" || status === "noc_generated" ? (
          <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700">
            <CheckCircle2 size={16} />
            SPOC review completed
          </span>
        ) : null}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-slate-400">Submitted</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {createdAt || "—"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-slate-400">Last updated</p>
          <p className="mt-1 text-sm font-medium text-slate-700">
            {updatedAt || "—"}
          </p>
        </div>
      </div>
    </DetailsCard>
  );
}
