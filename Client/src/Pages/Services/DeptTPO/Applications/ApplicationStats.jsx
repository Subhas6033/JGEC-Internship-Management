import {
  Building2,
  CheckCircle2,
  Clock3,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import { Card } from "../../../../Components";

const PENDING_STATUSES = ["submitted", "under_tpo_review", "update_required"];

const SPOC_STATUSES = ["under_spoc_review", "approved_by_spoc"];

const ApplicationStats = ({ applications = [] }) => {
  const safeApplications = Array.isArray(applications) ? applications : [];

  const organisations = new Set(
    safeApplications
      .map((application) => application?.organisation?._id)
      .filter(Boolean),
  );

  const pending = safeApplications.filter((application) =>
    PENDING_STATUSES.includes(application?.status),
  ).length;

  const accepted = safeApplications.filter(
    (application) => application?.status === "approved_by_tpo",
  ).length;

  const rejected = safeApplications.filter(
    (application) => application?.status === "rejected",
  ).length;

  const sentToSpoc = safeApplications.filter((application) =>
    SPOC_STATUSES.includes(application?.status),
  ).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <StatCard icon={Building2} label="Companies" value={organisations.size} />
      <StatCard
        icon={Users}
        label="Applications"
        value={safeApplications.length}
      />
      <StatCard icon={Clock3} label="Pending Review" value={pending} />
      <StatCard icon={CheckCircle2} label="Accepted" value={accepted} />
      <StatCard icon={XCircle} label="Rejected" value={rejected} />
      <StatCard icon={Send} label="Sent to SPOC" value={sentToSpoc} />
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
