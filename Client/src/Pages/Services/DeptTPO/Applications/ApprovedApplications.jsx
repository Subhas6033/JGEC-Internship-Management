import { useMemo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { CheckCircle2, MapPin, User } from "lucide-react";

import { Card, Button } from "../../../../Components";

const ApprovedApplications = () => {
  const navigate = useNavigate();

  const { filteredApplications = [] } = useOutletContext() || {};

  const applications = useMemo(
    () =>
      Array.isArray(filteredApplications)
        ? filteredApplications.filter(
            (application) => application?.status === "approved_by_tpo",
          )
        : [],
    [filteredApplications],
  );

  const handleReview = (applicationId) => {
    if (!applicationId) return;

    navigate(`/depttpo/applications/${applicationId}`);
  };

  if (applications.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-cream-dark text-ink-muted">
            <CheckCircle2 size={22} strokeWidth={1.8} />
          </span>

          <h3 className="mt-4 text-base font-semibold text-ink">
            No approved applications
          </h3>

          <p className="mt-1 max-w-md text-sm text-ink-muted">
            Applications approved by the Department TPO will appear here.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {applications.map((application) => {
        const student = application?.student;
        const organisation = application?.organisation;

        return (
          <Card key={application?._id} className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
                    <User size={18} strokeWidth={1.8} />
                  </span>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-ink">
                      {student?.fullName || "Unknown student"}
                    </h3>

                    <p className="mt-0.5 text-xs text-ink-muted">
                      {student?.rollNumber || "No roll number"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-xs text-ink-muted">Organisation</p>

                    <p className="mt-1 text-sm font-medium text-ink">
                      {organisation?.organisationName || "Unknown organisation"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-muted">Designation</p>

                    <p className="mt-1 text-sm font-medium text-ink">
                      {application?.designation || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-muted">Internship Type</p>

                    <p className="mt-1 text-sm font-medium capitalize text-ink">
                      {application?.internshipType || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-ink-muted">Mode</p>

                    <p className="mt-1 text-sm font-medium capitalize text-ink">
                      {application?.modeOfInternship || "Not specified"}
                    </p>
                  </div>
                </div>

                {organisation?.organisationLocation && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-ink-muted">
                    <MapPin size={14} strokeWidth={1.8} />

                    <span>{organisation.organisationLocation}</span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => handleReview(application?._id)}
              >
                View Application
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ApprovedApplications;
