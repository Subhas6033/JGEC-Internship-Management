import { motion } from "framer-motion";
import { fadeUp } from "../../../../Animations/animations";

const NocStatCard = ({
  icon: Icon,
  label,
  value = 0,
  helper,
  loading = false,
}) => {
  return (
    <motion.article
      variants={fadeUp}
      className="group h-31 w-full min-w-0 rounded-xl border border-border bg-surface shadow-(--shadow-card) transition-all duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-card-hover)"
    >
      <div className="flex h-full w-full items-center justify-between gap-3 px-4 py-3 sm:px-5">
        {loading ? (
          <>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-ink-muted/15" />
              <div className="h-7 w-12 animate-pulse rounded bg-ink-muted/15" />
              <div className="h-3 w-28 animate-pulse rounded bg-ink-muted/15" />
            </div>

            <div className="size-10 shrink-0 animate-pulse rounded-xl bg-ink-muted/15" />
          </>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
              <p className="truncate text-xs font-semibold leading-4 text-ink-muted sm:text-sm">
                {label}
              </p>

              <p className="text-2xl font-bold leading-7 tracking-tight text-ink tabular-nums">
                {value ?? 0}
              </p>

              <p className="line-clamp-2 min-h-8 text-xs leading-4 text-ink-muted">
                {helper}
              </p>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition-transform duration-200 group-hover:scale-105 sm:size-11">
              {Icon && <Icon size={20} aria-hidden="true" />}
            </span>
          </>
        )}
      </div>
    </motion.article>
  );
};

export default NocStatCard;
