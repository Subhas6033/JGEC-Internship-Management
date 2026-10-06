import {
  ArrowRight,
  Building2,
  CalendarDays,
  GraduationCap,
  User,
} from "lucide-react";
import { Button, Card } from "../../../../Components";
import TpoApplicationStatusBadge from "./TpoApplicationStatusBadge";

const formatDate = (value) => {
  if (!value) {
    return "N/A";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "N/A";
  }
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const TpoApplicationList = ({ applications = [] }) => {
  if (!applications.length) {
    return (
      <Card>
        <div className="p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream-soft">
            <GraduationCap className="h-6 w-6 text-ink-muted" />
          </div>

          <h3 className="mt-4 text-base font-semibold text-ink">
            No applications found
          </h3>

          <p className="mt-1 text-sm text-ink-muted">
            No applications match the selected filters.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => {
        const student = application?.student ?? {};
        const organisation = application?.organisation ?? {};
        const studentName = student?.fullName ?? "Unknown Student";
        const rollNumber = student?.rollNumber ?? "N/A";
        const department = student?.department ?? "N/A";
        const organisationName =
          organisation?.organisationName ??
          organisation?.name ??
          "Unknown Organisation";
        const organisationLocation =
          organisation?.organisationLocation ?? organisation?.location ?? "N/A";
        const isNocGenerated =
          application?.nocGenerated === true ||
          application?.nocStatus === "generated" ||
          application?.status === "noc_generated";

        return (
          <Card key={application?._id}>
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cream-soft">
                      <User className="h-5 w-5 text-ink-muted" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-ink sm:text-lg">
                        {studentName}
                      </h3>

                      <p className="mt-0.5 text-sm text-ink-muted">
                        Roll No: {rollNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <TpoApplicationStatusBadge status={application?.status} />

                  {isNocGenerated && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800">
                      NOC Generated
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2 xl:grid-cols-4">
                <ApplicationDetail
                  icon={GraduationCap}
                  label="Department"
                  value={department}
                />

                <ApplicationDetail
                  icon={Building2}
                  label="Organisation"
                  value={organisationName}
                />

                <ApplicationDetail
                  icon={CalendarDays}
                  label="Semester"
                  value={
                    application?.semester
                      ? `Semester ${application.semester}`
                      : "N/A"
                  }
                />

                <ApplicationDetail
                  icon={CalendarDays}
                  label="Application Date"
                  value={formatDate(application?.createdAt)}
                />
              </div>

              {/* Internship details */}
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-cream-soft p-3">
                  <p className="text-xs text-ink-muted">Internship</p>

                  <p className="mt-1 text-sm font-medium capitalize text-ink">
                    {application?.internshipType ?? "Not specified"}
                  </p>
                </div>

                <div className="rounded-lg bg-cream-soft p-3">
                  <p className="text-xs text-ink-muted">Mode</p>

                  <p className="mt-1 text-sm font-medium capitalize text-ink">
                    {application?.modeOfInternship ?? "Not specified"}
                  </p>
                </div>

                <div className="rounded-lg bg-cream-soft p-3">
                  <p className="text-xs text-ink-muted">Internship Period</p>

                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatDate(application?.tentativeStartDate)} -{" "}
                    {formatDate(application?.tentativeEndDate)}
                  </p>
                </div>

                <div className="rounded-lg bg-cream-soft p-3">
                  <p className="text-xs text-ink-muted">Location</p>

                  <p className="mt-1 text-sm font-medium text-ink">
                    {application?.tentativeWorkLocations?.length
                      ? application.tentativeWorkLocations.join(", ")
                      : organisationLocation}
                  </p>
                </div>
              </div>

              {/* Update required reason */}
              {application?.status === "update_required" &&
                application?.updateRequiredReason && (
                  <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                    <p className="text-xs font-medium text-yellow-800">
                      Update Required Reason
                    </p>

                    <p className="mt-1 text-sm text-yellow-900">
                      {application.updateRequiredReason}
                    </p>

                    {application?.updateRequiredBy && (
                      <p className="mt-2 text-xs text-yellow-800">
                        Requested by:{" "}
                        <span className="font-medium capitalize">
                          {application.updateRequiredBy}
                        </span>
                      </p>
                    )}
                  </div>
                )}

              {/* Footer */}
              <div className="mt-5 flex flex-col gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-ink-muted">
                  Application ID:{" "}
                  <span className="font-medium text-ink">
                    {application?._id ?? "N/A"}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    window.location.href = `/depttpo/applications/${application?._id}`;
                  }}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const ApplicationDetail = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0 text-ink-muted" />
        <p className="text-xs text-ink-muted">{label}</p>
      </div>
      <p className="mt-1 truncate text-sm font-medium text-ink">{value}</p>
    </div>
  );
};

export default TpoApplicationList;
