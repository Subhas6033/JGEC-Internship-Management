import { UserRound, X } from "lucide-react";

const StudentList = ({ students, removable = false, onRemove }) => {
  if (!students?.length) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-cream p-5 text-center">
        <p className="text-sm font-medium text-ink">No students selected</p>

        <p className="mt-1 text-xs text-ink-muted">
          All selected students have been removed from this application.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {students.map((student) => (
        <div
          key={student.id}
          className="
            flex items-center justify-between gap-3
            rounded-lg border border-border
            bg-surface p-3
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
              <UserRound size={16} />
            </span>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">
                {student.name}
              </p>

              <p className="mt-0.5 truncate text-xs text-ink-muted">
                {student.rollNo} · {student.department}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs font-medium text-ink-muted sm:block">
              CGPA {student.cgpa}
            </span>

            {removable && (
              <button
                type="button"
                onClick={() => onRemove?.(student)}
                className="
                  focus-ring rounded-md p-1.5
                  text-danger
                  transition-colors
                  hover:bg-danger/10
                "
                aria-label={`Remove ${student.name}`}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentList;
