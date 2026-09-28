import {
  Building2,
  CheckCircle2,
  Clock3,
  Send,
  Users,
  XCircle,
} from "lucide-react";

import { Card } from "../../../../Components";

const ApplicationStats = ({ applicationGroups = [] }) => {
  const students = applicationGroups.flatMap((group) => group.students);

  const totalStudents = students.length;

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

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <StatCard
        icon={Building2}
        label="Companies"
        value={applicationGroups.length}
      />

      <StatCard icon={Users} label="Applications" value={totalStudents} />

      <StatCard icon={Clock3} label="Pending Review" value={pending} />

      <StatCard icon={CheckCircle2} label="Accepted" value={accepted} />

      <StatCard icon={XCircle} label="Rejected" value={rejected} />

      <StatCard icon={Send} label="Sent to TPO" value={sentToTPO} />
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
          <Icon size={17} strokeWidth={1.8} />
        </span>

        <div>
          <p className="text-xs text-ink-muted">{label}</p>

          <p className="mt-0.5 text-xl font-semibold text-ink">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default ApplicationStats;
