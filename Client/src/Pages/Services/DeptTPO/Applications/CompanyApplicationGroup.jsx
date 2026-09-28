import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

import { Button, Card } from "../../../../Components";

const CompanyApplicationGroup = ({ group }) => {
  const students = group.students;

  const pending = students.filter(
    (student) => student.status === "pending_department_review",
  ).length;

  const accepted = students.filter(
    (student) => student.status === "department_accepted",
  ).length;

  const rejected = students.filter(
    (student) => student.status === "department_rejected",
  ).length;

  const sentToTPO = students.filter(
    (student) => student.status === "sent_to_tpo",
  ).length;

  const deadline = new Date(group.deadline);

  return (
    <Card className="overflow-hidden">
      {/* Company header */}
      <div className="flex flex-col gap-5 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Building2 size={22} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-semibold text-ink">
                {group.company.name}
              </h2>

              <span
                className={
                  group.status === "open"
                    ? "rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-semibold text-brand-700"
                    : "rounded-full bg-cream-dark px-2.5 py-1 text-[11px] font-semibold text-ink-muted"
                }
              >
                {group.status === "open"
                  ? "Applications Open"
                  : "Deadline Passed"}
              </span>
            </div>

            <p className="mt-1 text-sm text-ink-muted">{group.company.role}</p>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {group.company.location}
              </span>

              <span>{group.company.mode}</span>
            </div>
          </div>
        </div>

        {/* Deadline */}
        <div className="rounded-lg border border-border bg-cream px-4 py-3">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-ink-muted" />

            <div>
              <p className="text-[11px] text-ink-muted">Application deadline</p>

              <p className="mt-0.5 text-sm font-semibold text-ink">
                {deadline.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 divide-x divide-border border-b border-border sm:grid-cols-4">
        <GroupStat icon={Users} label="Students" value={students.length} />

        <GroupStat icon={Clock3} label="Pending" value={pending} />

        <GroupStat icon={CheckCircle2} label="Accepted" value={accepted} />

        <GroupStat icon={ArrowRight} label="Sent to TPO" value={sentToTPO} />
      </div>

      {/* Preview */}
      <div className="p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-ink">
              Student Applications
            </h3>

            <p className="mt-0.5 text-xs text-ink-muted">
              {students.length} students applied for this internship.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              window.location.href = `/depttpo/applications/${group.id}`;
            }}
          >
            Review Applications
            <ArrowRight size={14} />
          </Button>
        </div>

        <div className="mt-4 space-y-2">
          {students.slice(0, 3).map((student) => (
            <div
              key={student.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-cream px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-ink">{student.name}</p>

                <p className="mt-0.5 text-xs text-ink-muted">
                  {student.rollNumber} · {student.department}
                </p>
              </div>

              <StudentStatus status={student.status} />
            </div>
          ))}
        </div>

        {students.length > 3 && (
          <p className="mt-3 text-center text-xs text-ink-muted">
            +{students.length - 3} more students
          </p>
        )}

        {rejected > 0 && (
          <p className="mt-3 text-xs text-ink-muted">
            {rejected} application
            {rejected !== 1 ? "s" : ""} rejected by the department.
          </p>
        )}
      </div>
    </Card>
  );
};

const GroupStat = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Icon size={16} strokeWidth={1.8} className="text-ink-muted" />

      <div>
        <p className="text-xs text-ink-muted">{label}</p>

        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
};

const StudentStatus = ({ status }) => {
  const config = {
    pending_department_review: {
      label: "Pending Review",
      className: "bg-cream-dark text-ink-muted",
    },

    department_accepted: {
      label: "Department Accepted",
      className: "bg-brand-100 text-brand-700",
    },

    department_rejected: {
      label: "Rejected",
      className: "bg-cream-dark text-ink-muted",
    },

    sent_to_tpo: {
      label: "Sent to TPO",
      className: "bg-brand-700 text-white",
    },
  };

  const current = config[status] || config.pending_department_review;

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${current.className}`}
    >
      {current.label}
    </span>
  );
};

export default CompanyApplicationGroup;
