import { Eye, Pencil, UserRoundX, UserRoundCheck } from "lucide-react";

import { Table, Button } from "../../../../Components/index";
import StudentStatus from "./StudentStatus";

const StudentTable = ({
  students,
  loading,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  const columns = [
    {
      key: "student",
      header: "Student",
      width: "230px",
      render: (student) => (
        <div className="flex min-w-52.5 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-soft font-semibold text-brand-600">
            {student.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">{student.name}</p>

            <p className="mt-0.5 truncate text-xs text-ink-muted">
              {student.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "rollNumber",
      header: "Roll Number",
      width: "145px",
      render: (student) => (
        <span className="whitespace-nowrap text-sm font-medium text-ink">
          {student.rollNumber}
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      width: "260px",
      render: (student) => (
        <span className="block max-w-65 text-sm leading-5 text-ink-muted">
          {student.department}
        </span>
      ),
    },
    {
      key: "academicYear",
      header: "Year",
      width: "110px",
      render: (student) => (
        <span className="whitespace-nowrap text-sm text-ink">
          {student.academicYear}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "120px",
      render: (student) => <StudentStatus status={student.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      width: "130px",
      align: "right",
      render: (student) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(student)}
            title="View student"
          >
            <Eye size={17} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(student)}
            title="Edit student"
          >
            <Pencil size={17} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(student)}
            title={
              student.status === "Active"
                ? "Deactivate student"
                : "Activate student"
            }
          >
            {student.status === "Active" ? (
              <UserRoundX size={17} className="text-red-600" />
            ) : (
              <UserRoundCheck size={17} className="text-green-600" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="min-w-237.5">
        <Table
          columns={columns}
          data={students}
          loading={loading}
          getRowKey={(student) => student._id}
          emptyTitle="No students found"
          emptyDescription="Try changing your search or filter criteria."
          className="w-full"
          tableClassName="w-full"
        />
      </div>
    </div>
  );
};

export default StudentTable;
