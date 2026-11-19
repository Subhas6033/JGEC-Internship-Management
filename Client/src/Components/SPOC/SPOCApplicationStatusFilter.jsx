import { CheckCircle2, Clock3, XCircle, ArrowRight } from "lucide-react";
import { Button } from "../index";

const filters = [
  {
    key: "pending",
    label: "Pending",
    description: "Applications awaiting SPOC review",
    icon: Clock3,
    activeClass: "border-amber-300 bg-amber-50",
    iconClass: "bg-amber-100 text-amber-700",
    countClass: "bg-amber-600 text-white",
    activeTextClass: "text-amber-900",
  },
  {
    key: "accepted",
    label: "Accepted",
    description: "Applications accepted by SPOC",
    icon: CheckCircle2,
    activeClass: "border-emerald-300 bg-emerald-50",
    iconClass: "bg-emerald-100 text-emerald-700",
    countClass: "bg-emerald-600 text-white",
    activeTextClass: "text-emerald-900",
  },
  {
    key: "rejected",
    label: "Rejected",
    description: "Applications rejected by SPOC",
    icon: XCircle,
    activeClass: "border-rose-300 bg-rose-50",
    iconClass: "bg-rose-100 text-rose-700",
    countClass: "bg-rose-600 text-white",
    activeTextClass: "text-rose-900",
  },
];

const SPOCApplicationStatusFilter = ({
  activeStatus,
  onStatusChange,
  counts = {},
}) => {
  return (
    <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeStatus === filter.key;
        const count = counts?.[filter.key] ?? 0;

        return (
          <Button
            key={filter.key}
            type="button"
            variant="ghost"
            size="md"
            title={filter.description}
            onClick={() => onStatusChange(filter.key)}
            aria-pressed={isActive}
            className={`
              group relative h-auto! min-w-0! w-full
              items-center justify-between gap-3
              overflow-hidden rounded-xl border p-4
              text-left whitespace-normal
              transition-all duration-200 ease-out
              focus-visible:ring-2 focus-visible:ring-brand-500
              focus-visible:ring-offset-2
              ${
                isActive
                  ? `${filter.activeClass} shadow-sm`
                  : "border-border bg-surface hover:border-brand-200 hover:bg-cream-soft hover:shadow-sm"
              }
            `}
          >
            {/* Active indicator */}
            {isActive && (
              <span className="absolute inset-y-0 left-0 w-1 rounded-l-xl bg-current opacity-60" />
            )}

            {/* Main content */}
            <span className="flex min-w-0 flex-1 items-center gap-3">
              {/* Icon */}
              <span
                className={`
                  flex size-11 shrink-0 items-center justify-center
                  rounded-xl transition-colors duration-200
                  ${
                    isActive
                      ? filter.iconClass
                      : "bg-cream-dark text-ink-muted group-hover:bg-brand-50 group-hover:text-brand-700"
                  }
                `}
              >
                <Icon size={20} strokeWidth={2} />
              </span>

              {/* Text */}
              <span className="min-w-0 flex-1">
                <span
                  className={`
                    flex items-center gap-2
                    text-sm font-semibold
                    ${isActive ? filter.activeTextClass : "text-ink"}
                  `}
                >
                  {filter.label}

                  {isActive && (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                </span>

                <span className="mt-1 block text-xs leading-5 text-ink-muted">
                  {filter.description}
                </span>
              </span>
            </span>

            {/* Count and arrow */}
            <span className="flex shrink-0 items-center gap-2">
              <span
                className={`
                  flex h-8 min-w-8 items-center justify-center
                  rounded-full px-2 text-xs font-bold
                  tabular-nums transition-colors duration-200
                  ${
                    isActive
                      ? filter.countClass
                      : "bg-cream-dark text-ink-muted group-hover:bg-brand-100 group-hover:text-brand-800"
                  }
                `}
              >
                {count}
              </span>

              <ArrowRight
                size={15}
                className={`
                  hidden transition-all duration-200 sm:block
                  ${
                    isActive
                      ? "translate-x-0 opacity-70"
                      : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"
                  }
                `}
              />
            </span>
          </Button>
        );
      })}
    </div>
  );
};

export default SPOCApplicationStatusFilter;
