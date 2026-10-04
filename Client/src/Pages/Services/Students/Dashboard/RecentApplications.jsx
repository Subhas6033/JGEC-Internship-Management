import { ArrowUpRight, Building2, CalendarDays } from "lucide-react";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const statusLabels = {
  draft: "Draft",
  submitted: "Submitted",
  under_tpo_review: "Under TPO Review",
  update_required: "Update Required",
  approved_by_tpo: "Approved by TPO",
  under_spoc_review: "Under SPOC Review",
  approved_by_spoc: "Approved",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const getStatusClasses = (status) => {
  switch (status) {
    case "approved_by_spoc":
      return "bg-brand-50 text-brand-700";

    case "rejected":
      return "bg-red-50 text-red-700";

    case "update_required":
      return "bg-amber-50 text-amber-700";

    case "withdrawn":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-blue-50 text-blue-700";
  }
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const RecentApplications = ({ applications = [] }) => {
  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="visible"
      className="rounded-xl border border-border bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Applications</p>

          <h2 className="mt-1 font-display text-xl font-semibold text-ink">
            Recent applications
          </h2>
        </div>

        <Link
          to="/students/applications"
          className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-brand-700 transition-colors hover:text-brand-800"
        >
          View all
          <ArrowUpRight size={14} strokeWidth={2} />
        </Link>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border bg-surface-muted px-4 py-8 text-center">
          <Building2
            size={22}
            className="mx-auto text-ink-muted"
            strokeWidth={1.7}
          />

          <p className="mt-3 text-sm font-medium text-ink">
            No applications yet
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Your recent internship applications will appear here.
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="mt-5 divide-y divide-border"
        >
          {applications.map((application) => (
            <div
              key={application.id}
              className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Building2
                    size={16}
                    className="shrink-0 text-ink-muted"
                    strokeWidth={1.8}
                  />

                  <p className="truncate text-sm font-semibold text-ink">
                    {application.company}
                  </p>
                </div>

                <p className="mt-1 pl-6 text-xs text-ink-muted">
                  {application.role}
                </p>

                <div className="mt-2 flex items-center gap-1.5 pl-6 text-xs text-ink-muted">
                  <CalendarDays size={13} strokeWidth={1.8} />

                  {formatDate(application.date)}
                </div>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                  application.status,
                )}`}
              >
                {statusLabels[application.status] || application.status}
              </span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentApplications;
