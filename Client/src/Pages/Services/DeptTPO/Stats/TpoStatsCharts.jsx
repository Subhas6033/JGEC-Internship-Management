import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Card } from "../../../../Components";
import {
  sectionAnimation,
  transitions,
  useAnimationVariants,
} from "../../../../Animations/animations";

const nf = new Intl.NumberFormat("en-IN");

export const ChartCard = ({
  title,
  subtitle,
  action,
  className = "",
  children,
}) => {
  const variants = useAnimationVariants(sectionAnimation);
  return (
    <motion.div variants={variants} className={`min-w-0 ${className}`}>
      <Card className="h-full rounded-xl border border-border bg-cream-soft p-0 shadow-sm">
        <div className="flex h-full flex-col p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-ink">{title}</h3>
              {subtitle && (
                <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
              )}
            </div>
            {action}
          </div>
          <div className="@container min-h-0 flex-1">{children}</div>
        </div>
      </Card>
    </motion.div>
  );
};

const useBarTransition = () => {
  const reduce = useReducedMotion();
  return reduce ? transitions.instant : transitions.smooth;
};

/* ---------- Donut ---------- */
export const DonutChart = ({ data = [], centerLabel = "Applications" }) => {
  const [active, setActive] = useState(null);
  const reduce = useReducedMotion();
  const total = data.reduce((s, d) => s + d.value, 0);
  const R = 70;
  const visible = data.length > 1 ? 0.8 : 0;
  let cumulative = 0;
  const current = active !== null ? data[active] : null;

  return (
    <div className="flex flex-col items-center gap-5 @md:flex-row">
      <div className="relative size-44 shrink-0">
        <svg
          viewBox="0 0 180 180"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Status distribution: ${data.map((d) => `${d.value} ${d.label.toLowerCase()}`).join(", ")}`}
        >
          <circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            strokeWidth="22"
            className="stroke-cream-dark"
          />
          {data.map((d, i) => {
            const len = (d.value / total) * 100;
            const offset = cumulative;
            cumulative += len;
            return (
              <motion.circle
                key={d.key}
                cx="90"
                cy="90"
                r={R}
                fill="none"
                strokeWidth={active === i ? 26 : 22}
                stroke={d.color}
                pathLength="100"
                strokeDashoffset={-offset}
                initial={{ strokeDasharray: "0 100" }}
                animate={{
                  strokeDasharray: `${Math.max(len - visible, 0)} ${100 - Math.max(len - visible, 0)}`,
                }}
                transition={
                  reduce
                    ? transitions.instant
                    : { ...transitions.smooth, delay: 0.08 * i }
                }
                opacity={active === null || active === i ? 1 : 0.35}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              />
            );
          })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-ink">
            {nf.format(current ? current.value : total)}
          </span>
          <span className="mt-0.5 max-w-26 truncate text-xs text-ink-muted">
            {current ? current.label : centerLabel}
          </span>
        </div>
      </div>

      <ul className="w-full min-w-0 space-y-1.5">
        {data.map((d, i) => (
          <li key={d.key}>
            <button
              type="button"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="focus-ring flex w-full items-center justify-between gap-3 rounded-md px-2 py-1 text-left text-sm hover:bg-cream-dark/60"
            >
              <span className="flex min-w-0 items-center gap-2 text-ink-muted">
                <span
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{ background: d.color }}
                  aria-hidden="true"
                />
                <span className="truncate">{d.label}</span>
              </span>
              <span className="shrink-0 tabular-nums">
                <span className="font-semibold text-ink">{d.value}</span>
                <span className="ml-1.5 text-xs text-ink-muted">
                  {Math.round((d.value / total) * 100)}%
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ---------- Vertical bars (time series, semesters) ---------- */
export const BarColumns = ({
  data = [],
  color = "#166534",
  height = 200,
  ariaLabel,
}) => {
  const transition = useBarTransition();
  const max = Math.max(...data.map((d) => d.value), 0);
  const niceMax = Math.max(4, Math.ceil(max / 4) * 4);
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className="w-full overflow-x-auto pb-1"
    >
      {/* Keeps every bar and label readable; scrolls sideways on narrow cards. */}
      <div style={{ minWidth: data.length * 30 + 32 }}>
        <div className="relative mt-6" style={{ height }}>
          {ticks.map((t) => (
            <div
              key={t}
              className="absolute inset-x-0 flex items-center"
              style={{ bottom: `${t * 100}%` }}
            >
              <span className="w-8 shrink-0 pr-2 text-right text-[11px] tabular-nums text-ink-muted">
                {Math.round(niceMax * t)}
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>
          ))}
          <div className="absolute inset-y-0 left-8 right-0 flex items-end gap-1.5 @md:gap-2.5">
            {data.map((d, i) => (
              <div
                key={d.key}
                className="flex h-full min-w-0 flex-1 items-end justify-center"
                title={`${d.title || d.label}: ${d.value}`}
              >
                <motion.div
                  className="relative w-full max-w-11 rounded-t-md"
                  style={{ background: color, minHeight: d.value > 0 ? 3 : 0 }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / niceMax) * 100}%` }}
                  transition={{ ...transition, delay: 0.03 * i }}
                >
                  {d.value > 0 && data.length <= 12 && (
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-semibold tabular-nums text-ink">
                      {d.value}
                    </span>
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-2 flex gap-1.5 pl-8 @md:gap-2.5">
          {data.map((d) => (
            <div key={d.key} className="min-w-0 flex-1 text-center">
              <p className="truncate text-[11px] font-medium text-ink-muted">
                {d.label}
              </p>
              {d.sublabel && (
                <p className="truncate text-[10px] text-ink-muted/70">
                  {d.sublabel}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Horizontal (optionally stacked) bars ---------- */
export const HBarList = ({ rows = [], unit = "" }) => {
  const transition = useBarTransition();
  const max = Math.max(...rows.map((r) => r.total), 1);

  return (
    <ul className="space-y-3.5">
      {rows.map((row, i) => (
        <li key={row.key}>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span
              className="min-w-0 truncate font-medium text-ink"
              title={row.label}
            >
              {row.label}
              {row.sublabel && (
                <span className="ml-2 text-xs font-normal text-ink-muted">
                  {row.sublabel}
                </span>
              )}
            </span>
            <span className="shrink-0 tabular-nums font-semibold text-ink">
              {row.total}
              {unit && (
                <span className="ml-1 text-xs font-normal text-ink-muted">
                  {unit}
                </span>
              )}
            </span>
          </div>
          <div
            className="mt-1.5 flex h-2.5 gap-0.5 overflow-hidden rounded-full bg-cream-dark"
            style={{ width: "100%" }}
            role="img"
            aria-label={`${row.label}: ${row.segments.map((s) => `${s.value} ${s.label || ""}`.trim()).join(", ")}`}
          >
            {row.segments.map((s) => (
              <motion.span
                key={s.key}
                title={s.label ? `${s.label}: ${s.value}` : undefined}
                style={{ background: s.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(s.value / max) * 100}%` }}
                transition={{ ...transition, delay: 0.05 * i }}
              />
            ))}
          </div>
        </li>
      ))}
    </ul>
  );
};

export const Legend = ({ items }) => (
  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border pt-3">
    {items.map((item) => (
      <li
        key={item.label}
        className="flex items-center gap-1.5 text-xs text-ink-muted"
      >
        <span
          className="size-2.5 rounded-sm"
          style={{ background: item.color }}
          aria-hidden="true"
        />
        {item.label}
      </li>
    ))}
  </ul>
);

/* ---------- Radial gauge ---------- */
export const Gauge = ({ value = 0, total = 0, color = "#0ea5e9", label }) => {
  const reduce = useReducedMotion();
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const R = 62;
  return (
    <div className="flex flex-col items-center">
      <div className="relative size-40">
        <svg
          viewBox="0 0 160 160"
          className="size-full -rotate-90"
          role="img"
          aria-label={`${label}: ${value} of ${total} (${pct}%)`}
        >
          <circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            strokeWidth="14"
            className="stroke-cream-dark"
          />
          <motion.circle
            cx="80"
            cy="80"
            r={R}
            fill="none"
            strokeWidth="14"
            strokeLinecap="round"
            stroke={color}
            pathLength="100"
            strokeDasharray="100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 100 - pct }}
            transition={reduce ? transitions.instant : transitions.slow}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-ink">
            {pct}%
          </span>
          <span className="text-xs text-ink-muted">of applications</span>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-muted">
        <span className="font-semibold tabular-nums text-ink">{value}</span> of{" "}
        <span className="font-semibold tabular-nums text-ink">{total}</span>{" "}
        {label}
      </p>
    </div>
  );
};

export const ChartEmpty = ({
  message = "No data for the selected filters.",
}) => (
  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-ink-muted">
    {message}
  </div>
);

// Mirrors the real chart grid: 1 column, 2 columns, then the 6-column layout.
const SKELETON_SPANS = [
  "@2xl:col-span-2",
  "@2xl:col-span-2 @4xl:col-span-4",
  "@2xl:col-span-2 @4xl:col-span-4",
  "@2xl:col-span-2",
  "@4xl:col-span-3",
  "@4xl:col-span-3",
];

export const ChartsSkeleton = () => (
  <div
    className="grid grid-cols-1 gap-4 @2xl:grid-cols-2 @4xl:grid-cols-6"
    role="status"
    aria-label="Loading charts"
  >
    {SKELETON_SPANS.map((span, i) => (
      <div
        key={i}
        className={`h-72 animate-pulse rounded-xl border border-border bg-cream-soft ${span}`}
      />
    ))}
    <span className="sr-only">Loading charts…</span>
  </div>
);
