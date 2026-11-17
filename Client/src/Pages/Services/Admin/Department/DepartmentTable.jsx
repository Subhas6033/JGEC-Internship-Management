import { Eye } from "lucide-react";

import { Table, Button } from "../../../../Components/index";

const PeopleCell = ({ people }) => {
  if (!people?.length) {
    return <p className="text-sm text-ink-muted">Not assigned</p>;
  }

  const [first, ...rest] = people;

  return (
    <div className="min-w-40">
      <p className="text-sm font-medium text-ink">{first.name}</p>

      <p className="mt-0.5 text-xs text-ink-muted">
        {first.email}
        {rest.length > 0 && ` · +${rest.length} more`}
      </p>
    </div>
  );
};

const DepartmentTableLive = ({ departments, onView }) => {
  const columns = [
    {
      key: "department",
      header: "Department",
      width: "280px",
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
      key: "tpos",
      header: "Departmental TPO",
      width: "220px",
      render: (department) => <PeopleCell people={department.tpos} />,
    },
    {
      key: "spocs",
      header: "Departmental SPOC",
      width: "220px",
      render: (department) => <PeopleCell people={department.spocs} />,
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
      key: "actions",
      header: "Actions",
      width: "90px",
      align: "right",
      render: (department) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(department)}
            title="View department"
          >
            <Eye size={17} />
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
          getRowKey={(department) => department._id}
          emptyTitle="No departments found"
          emptyDescription="Try changing your search."
          className="w-full"
          tableClassName="w-full"
        />
      </div>
    </div>
  );
};

export default DepartmentTableLive;
