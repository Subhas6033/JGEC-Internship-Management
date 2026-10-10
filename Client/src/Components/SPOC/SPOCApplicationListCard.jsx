import {
  ArrowRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  MapPin,
  UsersRound,
  XCircle,
} from "lucide-react";
import { Button, Card } from "../index";

const statusConfig = {
  pending: {
    label: "Pending Review",
    icon: Clock3,
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "border-success/30 bg-success/10 text-success",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-danger/30 bg-danger/10 text-danger",
  },
};

const getStudentName = (student) =>
  student?.name ||
  student?.fullName ||
  student?.studentName ||
  "Unknown Student";
const getStudentEmail = (student) =>
  student?.email || student?.collegeEmail || student?.studentEmail || "—";
const getStudentRoll = (student) => student?.rollNumber || student?.roll || "—";
const getStudentDepartment = (student) =>
  student?.department?.name || student?.department || "—";
const getApplicationStatus = (application) => {
  if (
    application?.status === "approved_by_tpo" ||
    application?.status === "under_spoc_review"
  ) {
    return "pending";
  }

  if (
    application?.status === "approved_by_spoc" ||
    application?.status === "noc_generated"
  ) {
    return "accepted";
  }

  if (application?.status === "rejected") {
    return "rejected";
  }

  return "pending";
};

const SPOCApplicationListCard = ({
  application,
  onView,
  onAccept,
  onReject,
  onSendBack,
}) => {
  /*
   * IMPORTANT:
   * `application.students` may not exist when the backend
   * returns a single application.
   *
   * Always normalize it to an array.
   */
  const students = Array.isArray(application?.students)
    ? application.students
    : application?.student
      ? [application.student]
      : [];

  const organisation =
    application?.organisation || application?.organization || {};

  const companyName =
    application?.company ||
    application?.companyName ||
    organisation?.name ||
    organisation?.organisationName ||
    "Organisation";

  const location =
    application?.location ||
    application?.organisationLocation ||
    organisation?.location ||
    organisation?.city ||
    "—";

  const deadline =
    application?.deadline || application?.applicationDeadline || "—";

  /*
   * If the backend already sends grouped applications,
   * use them.
   *
   * Otherwise use the current application as the only row.
   */
  const applications = Array.isArray(application?.applications)
    ? application.applications
    : students.length > 0
      ? students.map((student, index) => ({
          ...application,
          student,
          id:
            student?._id ||
            student?.id ||
            `${application?._id || application?.id}-${index}`,
        }))
      : [application];

  const pendingCount = applications.filter(
    (item) => getApplicationStatus(item) === "pending",
  ).length;

  const acceptedCount = applications.filter(
    (item) => getApplicationStatus(item) === "accepted",
  ).length;

  const rejectedCount = applications.filter(
    (item) => getApplicationStatus(item) === "rejected",
  ).length;

  return (
    <Card
      className="
        w-full
        overflow-hidden
        border-border
        bg-surface
        shadow-(--shadow-card)
      "
    >
      {/* Company Header */}
      <div className="border-b border-border bg-cream-soft p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <span
              className="
                flex size-12 shrink-0
                items-center justify-center
                rounded-xl
                bg-brand-100
                text-brand-700
              "
            >
              <Building2 size={22} />
            </span>

            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-ink">
                {companyName}
              </h3>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                <MapPin size={14} />
                <span className="truncate">{location}</span>
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-wrap gap-2">
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                border border-brand-200
                bg-brand-50
                px-3 py-1.5
                text-xs font-semibold
                text-brand-700
              "
            >
              <UsersRound size={14} />
              {applications.length}{" "}
              {applications.length === 1 ? "Student" : "Students"}
            </span>

            {pendingCount > 0 && (
              <span
                className="
                  rounded-full
                  border border-warning/30
                  bg-warning/10
                  px-3 py-1.5
                  text-xs font-semibold
                  text-warning
                "
              >
                {pendingCount} Pending
              </span>
            )}

            {acceptedCount > 0 && (
              <span
                className="
                  rounded-full
                  border border-success/30
                  bg-success/10
                  px-3 py-1.5
                  text-xs font-semibold
                  text-success
                "
              >
                {acceptedCount} Accepted
              </span>
            )}

            {rejectedCount > 0 && (
              <span
                className="
                  rounded-full
                  border border-danger/30
                  bg-danger/10
                  px-3 py-1.5
                  text-xs font-semibold
                  text-danger
                "
              >
                {rejectedCount} Rejected
              </span>
            )}
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
          <CalendarDays size={14} />
          <span>Application Deadline:</span>
          <span className="font-semibold text-ink">{deadline}</span>
        </div>
      </div>
      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead>
            <tr className="border-b border-border bg-surface-soft">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Student
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Roll Number
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Department
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Status
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-muted">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.length > 0 ? (
              applications.map((item, index) => {
                const student = item?.student || {};
                const statusKey = getApplicationStatus(item);
                const status = statusConfig[statusKey] || statusConfig.pending;
                const StatusIcon = status.icon;
                const applicationId =
                  item?.applicationId ||
                  item?._id ||
                  item?.id ||
                  `${application?.organisation?._id || "organisation"}-${index}`;

                return (
                  <tr
                    key={applicationId}
                    className="
                      border-b border-border
                      last:border-b-0
                      transition-colors
                      hover:bg-cream-soft/60
                    "
                  >
                    {/* Students */}
                    <td className="px-5 py-4">
                      <div className="min-w-55">
                        <p className="text-sm font-semibold text-ink">
                          {getStudentName(student)}
                        </p>

                        <p className="mt-0.5 text-xs text-ink-muted">
                          {getStudentEmail(student)}
                        </p>
                      </div>
                    </td>

                    {/* RollNumber */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-ink">
                        {getStudentRoll(student)}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-ink">
                        {getStudentDepartment(student)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={[
                          "inline-flex items-center gap-1.5",
                          "rounded-full border px-2.5 py-1",
                          "text-xs font-semibold",
                          status.className,
                        ].join(" ")}
                      >
                        <StatusIcon size={13} />
                        {status.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* View Button */}
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => onView(item)}
                          className="
                            shrink-0
                            bg-brand-700
                            text-cream-soft
                            hover:bg-brand-800
                          "
                        >
                          View Details
                          <ArrowRight size={15} />
                        </Button>

                        {/* Accept Button*/}
                        {statusKey === "pending" && onAccept && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onAccept(item)}
                            className="
                              shrink-0
                              bg-success
                              text-white
                              hover:bg-success/90
                            "
                          >
                            <CheckCircle2 size={15} />
                            Accept
                          </Button>
                        )}

                        {/* Reject Button */}
                        {statusKey === "pending" && onReject && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onReject(item)}
                            className="
                              shrink-0
                              bg-danger
                              text-white
                              hover:bg-danger/90
                            "
                          >
                            <XCircle size={15} />
                            Reject
                          </Button>
                        )}

                        {/* Send Back Button */}
                        {statusKey === "pending" && onSendBack && (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => onSendBack(item)}
                            className="
                              shrink-0
                              border border-warning/30
                              bg-warning/10
                              text-warning
                              hover:bg-warning/20
                            "
                          >
                            Send Back
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center">
                  <UsersRound size={28} className="mx-auto text-ink-muted" />
                  <p className="mt-2 text-sm font-semibold text-ink">
                    No students found
                  </p>
                  <p className="mt-1 text-xs text-ink-muted">
                    No applications are available for this organisation.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border bg-surface-soft px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-ink-muted">Organisation Applications</p>
          <p className="mt-0.5 text-sm font-semibold text-ink">
            {applications.length}{" "}
            {applications.length === 1
              ? "student application"
              : "student applications"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <FileCheck2 size={14} />
          Review each student individually
        </div>
      </div>
    </Card>
  );
};

export default SPOCApplicationListCard;
