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

const SPOC_STATUSES = [
  "under_spoc_review",
  "approved_by_spoc",
  "noc_generated",
];

const ApplicationStats = ({ applications = [] }) => {
  const safeApplications = Array.isArray(applications) ? applications : [];

  // Count unique organisations without removing their applications
  const organisations = new Set(
    safeApplications
      .map((application) => {
        const organisation = application?.organisation;

        return typeof organisation === "object"
          ? organisation?._id
          : organisation;
      })
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

  const stats = [
    {
      label: "Organisations",
      value: organisations.size,
      description: "Unique organisations",
      icon: Building2,
      iconStyle: "bg-blue-50 text-blue-700",
    },
    {
      label: "Applications",
      value: safeApplications.length,
      description: "Total application records",
      icon: Users,
      iconStyle: "bg-violet-50 text-violet-700",
    },
    {
      label: "Pending Review",
      value: pending,
      description: "Requires TPO action",
      icon: Clock3,
      iconStyle: "bg-amber-50 text-amber-700",
    },
    {
      label: "Approved by TPO",
      value: accepted,
      description: "Approved applications",
      icon: CheckCircle2,
      iconStyle: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Rejected",
      value: rejected,
      description: "Rejected applications",
      icon: XCircle,
      iconStyle: "bg-red-50 text-red-700",
    },
    {
      label: "With SPOC",
      value: sentToSpoc,
      description: "Forwarded to company",
      icon: Send,
      iconStyle: "bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="group rounded-xl border border-border bg-cream-soft p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-muted">
                  {stat.label}
                </p>

                <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                  {stat.value}
                </p>

                <p className="mt-1 text-[11px] text-ink-muted">
                  {stat.description}
                </p>
              </div>

              <span
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${stat.iconStyle}`}
              >
                <Icon size={18} strokeWidth={1.8} />
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ApplicationStats;
