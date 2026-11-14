import { Eye, Pencil, Power } from "lucide-react";

import { Table, Button } from "../../../../Components/index";
import DepartmentStatus from "./DepartmentStatus";

const DepartmentTable = ({
  departments,
  loading,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  const columns = [
    {
      key: "department",
      header: "Department",
      width: "260px",
      render: (department) => (
        <div className="flex min-w-55 items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream-soft font-semibold text-brand-600">
            {department.code?.slice(0, 3)}
          </div>

          <div className="min-w-0">
            <p className="font-semibold text-ink">{department.name}</p>

            <p className="mt-0.5 text-xs text-ink-muted">
              Code: {department.code}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "hodName",
      header: "HOD",
      width: "190px",
      render: (department) => (
        <div className="min-w-40">
          <p className="text-sm font-medium text-ink">
            {department.hodName || "Not assigned"}
          </p>

          <p className="mt-0.5 text-xs text-ink-muted">
            {department.hodEmail || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "tpoName",
      header: "Departmental TPO",
      width: "190px",
      render: (department) => (
        <div className="min-w-40">
          <p className="text-sm font-medium text-ink">
            {department.tpoName || "Not assigned"}
          </p>

          <p className="mt-0.5 text-xs text-ink-muted">
            {department.tpoEmail || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "studentCount",
      header: "Students",
      width: "100px",
      render: (department) => (
        <span className="whitespace-nowrap text-sm font-medium text-ink">
          {department.studentCount}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      width: "110px",
      render: (department) => <DepartmentStatus status={department.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      width: "130px",
      align: "right",
      render: (department) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(department)}
            title="View department"
          >
            <Eye size={17} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(department)}
            title="Edit department"
          >
            <Pencil size={17} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(department)}
            title={
              department.status === "Active"
                ? "Deactivate department"
                : "Activate department"
            }
          >
            <Power
              size={17}
              className={
                department.status === "Active"
                  ? "text-red-600"
                  : "text-green-600"
              }
            />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="min-w-262.5">
        <Table
          columns={columns}
          data={departments}
          loading={loading}
          getRowKey={(department) => department._id}
          emptyTitle="No departments found"
          emptyDescription="Try changing your search or filter criteria."
          className="w-full"
          tableClassName="w-full"
        />
      </div>
    </div>
  );
};

export default DepartmentTable;
