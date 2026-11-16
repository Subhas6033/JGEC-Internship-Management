import { Eye, Pencil, UserCheck, UserX } from "lucide-react";

import { Table } from "../../../../Components/index";
import StaffStatus from "./StaffStatus";

const StaffTable = ({ staff, onView, onEdit, onToggleStatus }) => {
  const columns = [
    {
      key: "name",
      header: "Staff Member",
      render: (row) => (
        <div className="min-w-45">
          <p className="font-medium text-ink">{row.name}</p>

          <p className="mt-1 text-xs text-ink-muted">{row.employeeId}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <span
          className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${
            row.role === "TPO"
              ? "bg-blue-50 text-blue-700"
              : "bg-purple-50 text-purple-700"
          }`}
        >
          {row.role}
        </span>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (row) => (
        <span className="text-sm text-ink-muted">{row.department}</span>
      ),
    },
    {
      key: "email",
      header: "Official Email",
      render: (row) => (
        <span className="text-sm text-ink-muted">{row.email}</span>
      ),
    },
    {
      key: "status",
      header: "Account Status",
      render: (row) => <StaffStatus status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View details"
            onClick={() => onView(row)}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-cream-soft hover:text-brand-600 hover:cursor-pointer"
          >
            <Eye size={17} />
          </button>

          <button
            type="button"
            title="Edit staff"
            onClick={() => onEdit(row)}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-cream-soft hover:text-brand-600 hover:cursor-pointer"
          >
            <Pencil size={17} />
          </button>

          <button
            type="button"
            title={
              row.status === "Active"
                ? "Deactivate account"
                : "Activate account"
            }
            onClick={() => onToggleStatus(row._id)}
            className={`rounded-lg p-2 transition hover:cursor-pointer ${
              row.status === "Active"
                ? "text-ink-muted hover:bg-red-50 hover:text-red-600"
                : "text-ink-muted hover:bg-green-50 hover:text-green-700"
            }`}
          >
            {row.status === "Active" ? (
              <UserX size={17} />
            ) : (
              <UserCheck size={17} />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={staff}
      getRowKey={(row) => row._id}
      emptyTitle="No staff members found"
      emptyDescription="Try changing your filters or add a new TPO or SPOC."
      className="m-2"
    />
  );
};

export default StaffTable;
