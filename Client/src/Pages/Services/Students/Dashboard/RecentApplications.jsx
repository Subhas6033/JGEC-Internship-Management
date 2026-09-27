import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "../../../../Components/index";
import { recentApplications } from "./dashboard.data";

const RecentApplications = () => {
  return (
    <Card className="border-border bg-cream-soft p-5 shadow-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-muted">Recent activity</p>

          <h2 className="mt-1 text-lg font-semibold text-ink">
            Recent applications
          </h2>
        </div>

        <Link
          to="/students/applications"
          className="focus-ring inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          View all
          <ArrowRight size={15} />
        </Link>
      </div>

      <div className="mt-5 divide-y divide-border">
        {recentApplications.map((application) => (
          <div
            key={application.id}
            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">{application.company}</p>

              <p className="mt-1 text-sm text-ink-muted">{application.role}</p>

              <p className="mt-1 text-xs text-ink-muted">{application.date}</p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${
                application.status === "Approved"
                  ? "bg-brand-50 text-brand-700"
                  : "bg-cream-dark text-ink"
              }`}
            >
              {application.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentApplications;
