import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  Clock3,
  Send,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button, Card } from "../../../../Components";

import ApplicationStudentRow from "./ApplicationStudentRow";
import { applicationGroups } from "./application.data.js";

const CompanyApplicationDetails = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const group = applicationGroups.find((item) => item.id === companyId);

  const [selectedIds, setSelectedIds] = useState([]);

  const [students, setStudents] = useState(group?.students || []);

  const pendingStudents = useMemo(
    () =>
      students.filter(
        (student) => student.status === "pending_department_review",
      ),
    [students],
  );

  if (!group) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-cream-soft p-10 text-center">
        <h2 className="text-base font-semibold text-ink">Company not found</h2>

        <p className="mt-1 text-sm text-ink-muted">
          The requested application group does not exist.
        </p>

        <Link
          to="/depttpo/applications"
          className="mt-4 inline-flex text-sm font-medium text-brand-700"
        >
          Back to Applications
        </Link>
      </div>
    );
  }

  const toggleStudent = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const selectAll = () => {
    setSelectedIds(pendingStudents.map((student) => student.id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const acceptStudent = (student) => {
    setStudents((current) =>
      current.map((item) =>
        item.id === student.id
          ? {
              ...item,
              status: "department_accepted",
            }
          : item,
      ),
    );

    setSelectedIds((current) => current.filter((id) => id !== student.id));
  };

  const rejectStudent = (student) => {
    setStudents((current) =>
      current.map((item) =>
        item.id === student.id
          ? {
              ...item,
              status: "department_rejected",
            }
          : item,
      ),
    );

    setSelectedIds((current) => current.filter((id) => id !== student.id));
  };

  const acceptSelected = () => {
    setStudents((current) =>
      current.map((student) =>
        selectedIds.includes(student.id)
          ? {
              ...student,
              status: "department_accepted",
            }
          : student,
      ),
    );

    clearSelection();
  };

  const sendAcceptedToTPO = () => {
    setStudents((current) =>
      current.map((student) =>
        selectedIds.includes(student.id) &&
        student.status === "department_accepted"
          ? {
              ...student,
              status: "sent_to_tpo",
            }
          : student,
      ),
    );

    clearSelection();
  };

  const selectedStudents = students.filter((student) =>
    selectedIds.includes(student.id),
  );

  const acceptedSelectedCount = selectedStudents.filter(
    (student) => student.status === "department_accepted",
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "pending_department_review",
  ).length;

  const acceptedCount = students.filter(
    (student) => student.status === "department_accepted",
  ).length;

  const sentCount = students.filter(
    (student) => student.status === "sent_to_tpo",
  ).length;

  return (
    <div className="space-y-5">
      {/* Back */}
      <Link
        to="/depttpo/applications"
        className="focus-ring inline-flex items-center gap-2 text-sm font-medium text-ink-muted hover:text-ink"
      >
        <ArrowLeft size={15} />
        Applications
      </Link>

      {/* Company header */}
      <Card className="p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="eyebrow">Company Application Group</p>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
              {group.company.name}
            </h1>

            <p className="mt-1 text-sm text-ink-muted">{group.company.role}</p>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-ink-muted">
              <span>{group.company.location}</span>
              <span>{group.company.mode}</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-cream px-4 py-3">
            <div className="flex items-center gap-2">
              <CalendarClock size={17} className="text-ink-muted" />

              <div>
                <p className="text-[11px] text-ink-muted">
                  Application Deadline
                </p>

                <p className="text-sm font-semibold text-ink">
                  {new Date(group.deadline).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat icon={Users} label="Total Students" value={students.length} />

        <MiniStat icon={Clock3} label="Pending Review" value={pendingCount} />

        <MiniStat
          icon={CheckCircle2}
          label="Department Accepted"
          value={acceptedCount}
        />

        <MiniStat icon={Send} label="Sent to TPO" value={sentCount} />
      </div>

      {/* Students */}
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">
              Student Applications
            </h2>

            <p className="mt-1 text-xs text-ink-muted">
              Review students individually or select multiple applications.
            </p>
          </div>

          {pendingStudents.length > 0 && (
            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={selectAll}
              >
                Select All
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        <div>
          {students.map((student) => (
            <ApplicationStudentRow
              key={student.id}
              student={student}
              selected={selectedIds.includes(student.id)}
              onSelect={toggleStudent}
              onAccept={acceptStudent}
              onReject={rejectStudent}
              onView={(item) => console.log("View student:", item)}
            />
          ))}
        </div>
      </Card>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="sticky bottom-4 z-20 rounded-xl border border-border bg-cream-soft p-4 shadow-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">
                {selectedIds.length} student
                {selectedIds.length !== 1 ? "s" : ""} selected
              </p>

              <p className="mt-0.5 text-xs text-ink-muted">
                Review the selected applications before forwarding them to the
                TPO.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setStudents((current) =>
                    current.map((student) =>
                      selectedIds.includes(student.id)
                        ? {
                            ...student,
                            status: "department_rejected",
                          }
                        : student,
                    ),
                  );

                  clearSelection();
                }}
              >
                <X size={14} />
                Reject Selected
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={acceptSelected}
              >
                <Check size={14} />
                Accept Selected
              </Button>

              {acceptedSelectedCount > 0 && (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={sendAcceptedToTPO}
                >
                  <Send size={14} />
                  Send to TPO
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => navigate("/depttpo/applications/sent")}
        >
          View Sent to TPO
          <Send size={14} />
        </Button>
      </div>
    </div>
  );
};

const MiniStat = ({ icon: Icon, label, value }) => (
  <Card className="p-4">
    <div className="flex items-center gap-3">
      <span className="flex size-9 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
        <Icon size={17} />
      </span>

      <div>
        <p className="text-xs text-ink-muted">{label}</p>

        <p className="mt-0.5 text-xl font-semibold text-ink">{value}</p>
      </div>
    </div>
  </Card>
);

export default CompanyApplicationDetails;
