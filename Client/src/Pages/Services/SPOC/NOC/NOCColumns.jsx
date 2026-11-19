/** Columns shared by the pending and generated NOC tables. */
const identityColumns = [
  {
    key: "studentName",
    header: "Student",
    render: (noc) => (
      <span className="block min-w-40 font-semibold text-ink">
        {noc.studentName}
      </span>
    ),
  },
  {
    key: "rollNumber",
    header: "Roll No.",
    cellClassName: "whitespace-nowrap",
  },
  {
    key: "department",
    header: "Department",
    cellClassName: "whitespace-nowrap",
    render: (noc) => (
      <span className="inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
        {noc.department}
      </span>
    ),
  },
  {
    key: "company",
    header: "Organisation",
    render: (noc) => (
      <span className="block min-w-45 font-medium text-ink">{noc.company}</span>
    ),
  },
  {
    key: "location",
    header: "Location",
    render: (noc) => (
      <span className="block min-w-37.5 text-ink-muted">{noc.location}</span>
    ),
  },
];

export { identityColumns };
