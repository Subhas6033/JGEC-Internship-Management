import {
  Building2,
  CheckCircle2,
  Clock3,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "../../../../Components";
import { countByStatus, getOrganisationId } from "./applicationUtils";

// `activeGroup` / `onSelectGroup` are optional: cards become filters when provided.
const ApplicationStats = ({
  applications = [],
  activeGroup = null,
  onSelectGroup,
}) => {
  const list = Array.isArray(applications) ? applications : [];
  const counts = countByStatus(list);
  const organisationCount = new Set(list.map(getOrganisationId)).size;

  const stats = [
    {
      key: null,
      label: "Organisations",
      value: organisationCount,
      hint: "With applications",
      icon: Building2,
      tone: "bg-blue-50 text-blue-700",
      clickable: false,
    },
    {
      key: "all",
      label: "Applications",
      value: counts.total,
      hint: "Student records",
      icon: Users,
      tone: "bg-cream-dark text-ink",
      clickable: true,
    },
    {
      key: "pending",
      label: "Pending review",
      value: counts.pending,
      hint: "Needs attention",
      icon: Clock3,
      tone: "bg-amber-50 text-amber-700",
      clickable: true,
    },
    {
      key: "approved",
      label: "Approved by TPO",
      value: counts.approved,
      hint: "Ready to forward",
      icon: CheckCircle2,
      tone: "bg-emerald-50 text-emerald-700",
      clickable: true,
    },
    {
      key: "rejected",
      label: "Rejected",
      value: counts.rejected,
      hint: "Closed",
      icon: XCircle,
      tone: "bg-red-50 text-red-700",
      clickable: true,
    },
    {
      key: "spoc",
      label: "Forwarded to SPOC",
      value: counts.spoc,
      hint: "With the organisation",
      icon: Send,
      tone: "bg-violet-50 text-violet-700",
      clickable: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const interactive = stat.clickable && onSelectGroup;
        const selected =
          stat.key === "all"
            ? !activeGroup
            : stat.key && activeGroup === stat.key;

        const body = (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 text-left">
              <p className="truncate text-xs font-medium text-ink-muted">
                {stat.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-ink">
                {stat.value}
              </p>
              <p className="mt-1 truncate text-[11px] text-ink-muted">
                {stat.hint}
              </p>
            </div>
            <span
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.tone}`}
            >
              <Icon size={17} strokeWidth={1.8} />
            </span>
          </div>
        );

        return (
          <Card
            key={stat.label}
            className={`rounded-xl border bg-cream-soft p-0 shadow-sm ${
              selected && interactive
                ? "border-brand-700 ring-1 ring-brand-700"
                : "border-border"
            }`}
          >
            {interactive ? (
              <button
                type="button"
                aria-pressed={Boolean(selected)}
                onClick={() =>
                  onSelectGroup(stat.key === "all" ? null : stat.key)
                }
                className="focus-ring w-full rounded-xl p-4 transition-colors hover:bg-cream-dark/50"
              >
                {body}
              </button>
            ) : (
              <div className="p-4">{body}</div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
