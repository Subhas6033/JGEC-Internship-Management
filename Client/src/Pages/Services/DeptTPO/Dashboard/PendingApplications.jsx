import { Clock3, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../../../Components";

const PendingApplications = ({ applications = [] }) => {
  const navigate = useNavigate();

  const handleReview = (applicationId) => {
    // Application ID is required to open the exact application.
    if (!applicationId) return;

    navigate(`/depttpo/applications/${applicationId}`);
  };

  if (!applications.length) {
    return (
      <Card className="p-5">
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
            <Clock3 size={20} />
          </span>

          <h3 className="mt-3 text-sm font-semibold text-ink">
            No Pending Applications
          </h3>

          <p className="mt-1 max-w-sm text-xs text-ink-muted">
            There are currently no applications requiring TPO review.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-border p-5">
        <div>
          <h2 className="text-base font-semibold text-ink">
            Pending Applications
          </h2>

          <p className="mt-1 text-xs text-ink-muted">
            Applications requiring your attention.
          </p>
        </div>

        <span className="rounded-full bg-cream-dark px-2.5 py-1 text-xs font-medium text-ink">
          {applications.length}
        </span>
      </div>

      <div className="divide-y divide-border">
        {applications.map((application) => {
          const studentName =
            application?.student?.fullName ?? "Unknown Student";
          const rollNumber = application?.student?.rollNumber ?? "N/A";
          const organisationName =
            application?.organisation?.name ?? "Unknown Organisation";
          const designation = application?.designation ?? "Internship";
          const status = application?.status ?? "submitted";

          return (
            <div
              key={application?._id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {studentName}
                  </h3>

                  <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                    {rollNumber}
                  </span>
                </div>

                <p className="mt-1 text-xs text-ink-muted">
                  {organisationName}
                </p>

                <p className="mt-1 text-xs text-ink-muted">{designation}</p>

                <div className="mt-2">
                  <span className="text-[11px] capitalize text-ink-muted">
                    {status.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="
                  shrink-0
                  border-border
                  bg-transparent
                  hover:bg-cream-dark
                "
                onClick={() => handleReview(application?._id)}
              >
                <Eye size={14} />
                Review
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default PendingApplications;
