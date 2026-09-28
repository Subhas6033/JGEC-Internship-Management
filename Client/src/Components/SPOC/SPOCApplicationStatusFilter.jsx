import { CheckCircle2, Clock3, XCircle } from "lucide-react";

const filters = [
  {
    key: "pending",
    label: "Pending",
    description: "Applications awaiting SPOC review",
    icon: Clock3,
  },
  {
    key: "accepted",
    label: "Accepted",
    description: "Applications accepted by SPOC",
    icon: CheckCircle2,
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Applications rejected by SPOC",
    icon: XCircle,
  },
];

const SPOCApplicationStatusFilter = ({
  activeStatus,
  onStatusChange,
  counts,
}) => {
  return (
    <div
      className="
        grid w-full min-w-0
        grid-cols-1 gap-2
        sm:grid-cols-3
      "
    >
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeStatus === filter.key;

        return (
          <button
            key={filter.key}
            type="button"
            title={filter.description}
            onClick={() => onStatusChange(filter.key)}
            aria-pressed={isActive}
            className={[
              "focus-ring",
              "flex min-w-0 items-center justify-between",
              "rounded-xl border px-4 py-3",
              "text-left",
              "transition-all duration-200",
              isActive
                ? [
                    "border-brand-300",
                    "bg-brand-100",
                    "text-brand-800",
                    "shadow-sm",
                  ].join(" ")
                : [
                    "border-border",
                    "bg-surface",
                    "text-ink-muted",
                    "hover:border-brand-200",
                    "hover:bg-brand-50",
                    "hover:text-ink",
                  ].join(" "),
            ].join(" ")}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span
                className={[
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  isActive
                    ? "bg-brand-200 text-brand-800"
                    : "bg-cream-dark text-ink-muted",
                ].join(" ")}
              >
                <Icon size={17} strokeWidth={2} />
              </span>

              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">
                  {filter.label}
                </span>

                <span className="mt-0.5 block truncate text-[11px] text-ink-muted">
                  {filter.description}
                </span>
              </span>
            </span>

            <span
              className={[
                "ml-3 flex size-7 shrink-0 items-center justify-center",
                "rounded-full text-xs font-bold",
                isActive
                  ? "bg-brand-700 text-cream-soft"
                  : "bg-cream-dark text-ink-muted",
              ].join(" ")}
            >
              {counts?.[filter.key] ?? 0}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SPOCApplicationStatusFilter;
