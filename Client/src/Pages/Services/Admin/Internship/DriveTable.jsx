import { Eye, Pencil, Send, XCircle } from "lucide-react";

import { Table } from "../../../../Components/index";
import DriveStatus from "./DriveStatus";

const DriveTable = ({ drives, onView, onEdit, onPublish, onClose }) => {
  const columns = [
    {
      key: "title",
      header: "Internship Drive",
      render: (row) => (
        <div className="min-w-47.5">
          <p className="font-medium text-ink">{row.title}</p>

          <p className="mt-1 text-xs text-ink-muted">{row.company}</p>
        </div>
      ),
    },
    {
      key: "location",
      header: "Location",
      render: (row) => (
        <span className="text-sm text-ink-muted">{row.location}</span>
      ),
    },
    {
      key: "deadline",
      header: "Deadline",
      render: (row) => (
        <span className="whitespace-nowrap text-sm text-ink">
          {row.deadline || "—"}
        </span>
      ),
    },
    {
      key: "applications",
      header: "Applications",
      align: "center",
      render: (row) => (
        <span className="font-medium text-ink">{row.applications}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <DriveStatus status={row.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            title="View drive"
            onClick={() => onView(row)}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-cream-soft hover:text-brand-600"
          >
            <Eye size={17} />
          </button>

          <button
            type="button"
            title="Edit drive"
            onClick={() => onEdit(row)}
            className="rounded-lg p-2 text-ink-muted transition hover:bg-cream-soft hover:text-brand-600"
          >
            <Pencil size={17} />
          </button>

          {row.status === "Draft" && (
            <button
              type="button"
              title="Publish drive"
              onClick={() => onPublish(row._id)}
              className="rounded-lg p-2 text-ink-muted transition hover:bg-green-50 hover:text-green-700"
            >
              <Send size={17} />
            </button>
          )}

          {row.status === "Published" && (
            <button
              type="button"
              title="Close drive"
              onClick={() => onClose(row._id)}
              className="rounded-lg p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-600"
            >
              <XCircle size={17} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      className="mt-5"
      columns={columns}
      data={drives}
      getRowKey={(row) => row._id}
      emptyTitle="No internship drives found"
      emptyDescription="Create a new drive or change your search filters."
    />
  );
};

export default DriveTable;
