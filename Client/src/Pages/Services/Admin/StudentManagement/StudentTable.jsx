import { motion } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Table, Button } from "../../../../Components/index";

const StudentTable = ({
  students = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  deletingId,
}) => {
  const columns = [
    {
      key: "student",
      header: "Student",
      width: "250px",
      render: (student) => (
        <div className="flex min-w-52 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-soft font-semibold text-brand-600">
            {student.fullName?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-ink">
              {student.fullName}
            </p>
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
      width: "120px",
      render: (student) => (
        <span className="text-sm text-ink-muted">{student.department}</span>
      ),
    },
    {
      key: "mobileNumber",
      header: "Mobile",
      width: "150px",
      render: (student) => (
        <span className="whitespace-nowrap text-sm text-ink-muted">
          {student.mobileNumber}
        </span>
      ),
    },
    {
      key: "guardianName",
      header: "Guardian",
      width: "180px",
      render: (student) => (
        <span className="text-sm text-ink-muted">{student.guardianName}</span>
      ),
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
            disabled={deletingId === student._id}
            onClick={() => onDelete(student)}
            title="Delete student"
          >
            <Trash2 size={17} className="text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="w-full min-w-0 overflow-x-auto"
    >
      <div className="min-w-225">
        <Table
          columns={columns}
          data={students}
          loading={loading}
          getRowKey={(student) => student._id}
          emptyTitle="No students found"
          emptyDescription="Try changing your search or department filter."
          className="w-full"
          tableClassName="w-full"
        />
      </div>
    </motion.div>
  );
};

export default StudentTable;
