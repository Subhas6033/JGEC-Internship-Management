import { Check, Eye, Undo2 } from "lucide-react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import {
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";
import {
  REVIEWABLE_STATUSES,
  formatDate,
  getInitials,
  getStudent,
  getSubmittedAt,
} from "./applicationUtils";

// Every column except the first has a FIXED width, so each row (and the header)
// resolves to the exact same grid and columns line up perfectly.
export const ROW_GRID =
  "xl:grid-cols-[minmax(0,1fr)_11rem_4.5rem_7rem_10.5rem_18rem]";

const base =
  "focus-ring inline-flex h-8 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const RowButton = ({ variant = "secondary", className = "", ...props }) => {
  const styles = {
    ghost: "text-ink-muted hover:bg-cream-dark hover:text-ink hover:cursor-pointer",
    secondary: "border border-border bg-white text-ink hover:bg-cream-dark hover:cursor-pointer",
    primary: "bg-brand-700 text-white hover:bg-brand-700/90 hover:cursor-pointer",
  };
  return (
    <button
      type="button"
      className={`${base} ${styles[variant]} ${className}`}
      {...props}
    />
  );
};

const Cell = ({ label, children, className = "" }) => (
  <div className={`min-w-0 ${className}`}>
    <p className="mb-0.5 text-[11px] font-medium text-ink-muted xl:hidden">
      {label}
    </p>
    <div className="text-sm text-ink">{children}</div>
  </div>
);

const ApplicationStudentRow = ({
  application,
  busy = false,
  onView,
  onAccept,
  onSendBack,
}) => {
  const rowVariants = useAnimationVariants(sectionAnimation);
  const student = getStudent(application);
  const name = student.fullName || student.name || "Student name unavailable";
  const canReview = REVIEWABLE_STATUSES.includes(application?.status);
  const semester = application?.semester ?? student.semester;
  const department = student.department || student.branch;

  return (
    <motion.li
      variants={rowVariants}
      className={`relative grid gap-4 border-b border-border px-5 py-4 transition-colors last:border-b-0 hover:bg-cream/50 xl:items-center xl:gap-4 ${ROW_GRID}`}
    >
      {/* Marks rows that are waiting for the TPO */}
      {canReview && (
        <span
          className="absolute inset-y-0 left-0 w-0.5 bg-amber-500"
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cream-dark text-xs font-semibold text-ink">
          {getInitials(name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{name}</p>
          <p className="mt-0.5 flex items-center gap-2 text-xs text-ink-muted">
            <span className="tabular-nums">
              {student.rollNumber || "No roll number"}
            </span>
            {department && (
              <>
                <span className="h-3 w-px bg-border" aria-hidden="true" />
                <span className="truncate">{department}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:contents">
        <Cell label="Internship role">
          <span className="block truncate">
            {application?.designation || "—"}
          </span>
        </Cell>
        <Cell label="Semester">
          <span className="tabular-nums">{semester ?? "—"}</span>
        </Cell>
        <Cell label="Submitted">
          <span className="whitespace-nowrap tabular-nums">
            {formatDate(getSubmittedAt(application))}
          </span>
        </Cell>
        <Cell label="Status">
          <StatusBadge status={application?.status} />
        </Cell>
      </div>

      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <RowButton
          variant={canReview ? "ghost" : "secondary"}
          onClick={() => onView?.(application)}
          disabled={!application?._id}
          aria-label={`View application of ${name}`}
        >
          <Eye size={14} />
          View
        </RowButton>
        {canReview && (
          <>
            <RowButton
              onClick={() => onSendBack?.(application)}
              disabled={busy}
              aria-label={`Send back application of ${name}`}
            >
              <Undo2 size={14} />
              Send back
            </RowButton>
            <RowButton
              variant="primary"
              onClick={() => onAccept?.(application)}
              disabled={busy}
              aria-label={`Accept application of ${name}`}
            >
              <Check size={14} />
              {busy ? "Working…" : "Accept"}
            </RowButton>
          </>
        )}
      </div>
    </motion.li>
  );
};

export default ApplicationStudentRow;
