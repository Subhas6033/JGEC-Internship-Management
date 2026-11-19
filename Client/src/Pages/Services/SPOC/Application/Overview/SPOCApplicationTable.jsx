import { useMemo } from "react";
import { Button, Table } from "../../../../../Components/index";
import SPOCApplicationStatusBadge from "./SPOCApplicationStatusBadge";

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "N/A";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const SPOCApplicationTable = ({
  applications,
  loading,
  onView,
  emptyDescription,
}) => {
  const columns = useMemo(
    () => [
      {
        key: "applicationId",
        header: "Application ID",
        render: (application) => (
          <span className="whitespace-nowrap text-sm font-semibold text-ink">
            {application.applicationId ||
              application._id ||
              application.id ||
              "N/A"}
          </span>
        ),
      },
      {
        key: "student",
        header: "Student",
        render: (application) => {
          const student = application.student || {};

          return (
            <div className="min-w-42.5">
              <p className="text-sm font-semibold text-ink">
                {student.fullName || student.name || "Unknown Student"}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {student.email || "N/A"}
              </p>
            </div>
          );
        },
      },
      {
        key: "rollNumber",
        header: "Roll No.",
        render: (application) => (
          <span className="whitespace-nowrap text-sm text-ink">
            {application.student?.rollNumber || "N/A"}
          </span>
        ),
      },
      {
        key: "department",
        header: "Department",
        render: (application) => (
          <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            {application.student?.department || "N/A"}
          </span>
        ),
      },
      {
        key: "organisation",
        header: "Organisation",
        render: (application) => {
          const organisation = application.organisation || {};

          return (
            <div className="min-w-47.5">
              <p className="text-sm font-medium text-ink">
                {organisation.organisationName ||
                  organisation.name ||
                  application.companyName ||
                  "Unknown Organisation"}
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {organisation.organisationLocation ||
                  organisation.location ||
                  "N/A"}
              </p>
            </div>
          );
        },
      },
      {
        key: "internship",
        header: "Internship",
        render: (application) => (
          <div className="min-w-30">
            <p className="text-sm font-medium capitalize text-ink">
              {application.internshipType || "N/A"}
            </p>
            <p className="mt-0.5 text-xs capitalize text-ink-muted">
              {application.modeOfInternship || "N/A"}
            </p>
          </div>
        ),
      },
      {
        key: "dates",
        header: "Dates",
        render: (application) => (
          <div className="whitespace-nowrap text-xs text-ink">
            <p>{formatDate(application.tentativeStartDate)}</p>
            <p className="mt-0.5 text-ink-muted">
              to {formatDate(application.tentativeEndDate)}
            </p>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (application) => (
          <span title={`Backend status: ${application.status || "unknown"}`}>
            <SPOCApplicationStatusBadge
              status={application.displayStatus || application.status}
            />
          </span>
        ),
      },
      {
        key: "action",
        header: "Action",
        align: "right",
        render: (application) => (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={() => onView(application)}
            >
              View
            </Button>
          </div>
        ),
      },
    ],
    [onView],
  );

  return (
    <Table
      columns={columns}
      data={applications}
      loading={loading}
      getRowKey={(application, index) =>
        application._id || application.id || index
      }
      emptyTitle="No applications found"
      emptyDescription={emptyDescription}
      tableClassName="min-w-[1100px]"
    />
  );
};

export default SPOCApplicationTable;
