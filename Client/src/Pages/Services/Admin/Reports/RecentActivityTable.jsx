import { Table } from "../../../../Components/index";

const RecentActivityTable = ({ activities }) => {
  const columns = [
    {
      key: "activity",
      header: "Activity",
      render: (row) => (
        <div className="min-w-55">
          <p className="text-sm font-semibold text-ink">{row.activity}</p>
          <p className="mt-1 text-xs text-ink-muted">{row.description}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (row) => (
        <span className="rounded-lg bg-cream-soft px-2.5 py-1 text-xs font-medium text-ink-muted">
          {row.category}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      render: (row) => (
        <span className="whitespace-nowrap text-sm text-ink-muted">
          {row.date}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            row.status === "Completed"
              ? "bg-green-50 text-green-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <div className="min-w-175">
        <Table
          columns={columns}
          data={activities}
          getRowKey={(row) => row._id}
          emptyTitle="No recent activity"
          emptyDescription="There are no recent activities to display."
          className="w-full"
          tableClassName="w-full"
        />
      </div>
    </div>
  );
};

export default RecentActivityTable;
