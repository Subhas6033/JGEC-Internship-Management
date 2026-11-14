import { ChevronDown, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ApplicationStudentRow, { ROW_GRID } from "./ApplicationStudentRow";
import { getOrgInitials, getOrgTone } from "./applicationUtils";
import {
  sectionAnimation,
  mobileMenu,
  staggerFast,
  useAnimationVariants,
} from "../../../../Animations/animations";

const SEGMENTS = [
  {
    key: "pending",
    label: "Pending",
    bar: "bg-amber-400",
    dot: "bg-amber-500",
  },
  {
    key: "approved",
    label: "Approved",
    bar: "bg-emerald-600",
    dot: "bg-emerald-600",
  },
  { key: "rejected", label: "Rejected", bar: "bg-red-400", dot: "bg-red-500" },
  {
    key: "spoc",
    label: "With SPOC",
    bar: "bg-violet-400",
    dot: "bg-violet-500",
  },
  {
    key: "other",
    label: "Other",
    bar: "bg-ink-muted/30",
    dot: "bg-ink-muted/40",
  },
];

const Stat = ({ segment, value }) => (
  <div className={`min-w-18 ${value === 0 ? "opacity-45" : ""}`}>
    <p className="text-lg font-semibold leading-none tabular-nums text-ink">
      {value}
    </p>
    <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
      <span
        className={`size-1.5 rounded-full ${segment.dot}`}
        aria-hidden="true"
      />
      {segment.label}
    </p>
  </div>
);

const OrganisationApplicationGroup = ({
  group,
  expanded,
  onToggle,
  busyId,
  onView,
  onAccept,
  onSendBack,
}) => {
  const { counts } = group;
  const itemVariants = useAnimationVariants(sectionAnimation);
  const panelVariants = useAnimationVariants(mobileMenu);
  const rowsVariants = useAnimationVariants(staggerFast);
  const panelId = `org-panel-${group.id}`;
  const visibleSegments = SEGMENTS.filter(
    (s) => s.key !== "other" || counts.other > 0,
  );
  const summary = SEGMENTS.filter((s) => counts[s.key] > 0)
    .map((s) => `${counts[s.key]} ${s.label.toLowerCase()}`)
    .join(", ");

  return (
    <motion.section
      variants={itemVariants}
      className="overflow-hidden rounded-xl border border-border bg-white shadow-sm"
    >
      <button
        type="button"
        onClick={() => onToggle(group.id)}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="focus-ring block w-full px-5 py-4 text-left transition-colors hover:bg-cream/40"
      >
        <div className="flex items-center gap-4">
          <span
            className={`flex size-11 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${getOrgTone(group.id)}`}
            aria-hidden="true"
          >
            {getOrgInitials(group.name)}
          </span>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-semibold text-ink">
              {group.name}
            </h2>
            <p className="mt-0.5 flex items-center gap-x-3 text-sm text-ink-muted">
              {group.location && (
                <span className="flex min-w-0 items-center gap-1.5">
                  <MapPin size={13} strokeWidth={1.8} className="shrink-0" />
                  <span className="truncate">{group.location}</span>
                </span>
              )}
              <span className="shrink-0 font-medium text-ink">
                {counts.total}{" "}
                {counts.total === 1 ? "application" : "applications"}
              </span>
            </p>
          </div>

          <div className="hidden items-start gap-5 md:flex">
            {visibleSegments.map((segment) => (
              <Stat
                key={segment.key}
                segment={segment}
                value={counts[segment.key]}
              />
            ))}
          </div>

          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`shrink-0 text-ink-muted transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        </div>

        {/* Compact counts on small screens (stats above are hidden) */}
        <p className="mt-3 text-xs text-ink-muted md:hidden">{summary}</p>

        <div
          role="img"
          aria-label={`Status distribution: ${summary || "no applications"}`}
          className="mt-4 flex h-1 w-full gap-0.5 overflow-hidden rounded-full"
        >
          {SEGMENTS.map((s) =>
            counts[s.key] > 0 ? (
              <span
                key={s.key}
                className={`${s.bar} first:rounded-l-full last:rounded-r-full`}
                style={{ width: `${(counts[s.key] / counts.total) * 100}%` }}
              />
            ) : null,
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-label={`Applications to ${group.name}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-hidden border-t border-border"
          >
            <div
              aria-hidden="true"
              className={`hidden gap-4 border-b border-border bg-cream px-5 py-2.5 text-xs font-medium text-ink-muted xl:grid ${ROW_GRID}`}
            >
              <span>Student</span>
              <span>Internship role</span>
              <span>Sem</span>
              <span>Submitted</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>
            <motion.ul
              variants={rowsVariants}
              initial="hidden"
              animate="visible"
            >
              {group.applications.map((application, index) => (
                <ApplicationStudentRow
                  key={application?._id || `${group.id}-${index}`}
                  application={application}
                  busy={busyId === application?._id}
                  onView={onView}
                  onAccept={onAccept}
                  onSendBack={onSendBack}
                />
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default OrganisationApplicationGroup;
