import { Table } from "../../../../Components/index";

const getStatusStyle = (status) => {
  const styles = {
    Selected: "bg-green-100 text-green-700",
    Approved: "bg-green-100 text-green-700",
    Pending: "bg-amber-100 text-amber-700",
    "Update Required": "bg-blue-100 text-blue-700",
    Shortlisted: "bg-blue-100 text-blue-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return styles[status] || "bg-gray-100 text-gray-700";
};

const columns = [
  {
    key: "student",
    header: "Student",
    render: (row) => (
      <div>
        <p className="font-medium text-ink">{row.student}</p>
        <p className="text-xs text-muted-foreground">{row.rollNumber}</p>
      </div>
    ),
  },
  {
    key: "company",
    header: "Company",
  },
  {
    key: "role",
    header: "Position",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusStyle(
          row.status,
        )}`}
      >
        {row.status}
      </span>
    ),
  },
  {
    key: "date",
    header: "Applied On",
    render: (row) => {
      const date = row.date ? new Date(row.date) : null;
      return (
        <span className="text-xs text-muted-foreground">
          {date
            ? date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </span>
      );
    },
  },
];

const RecentApplications = ({ data = [], onViewAll }) => {
  const applications = Array.isArray(data) && data.length > 0
    ? data
    : [];

  return (
    <section className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">Recent Applications</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Latest student internship applications
          </p>
        </div>
      </div>

      <Table
        columns={columns}
        data={applications}
        loading={false}
        emptyTitle="No applications found"
        emptyDescription="Student applications will appear here."
        getRowKey={(row) => row.id || row._id}
      />
    </section>
  );
};

export default RecentApplications;
