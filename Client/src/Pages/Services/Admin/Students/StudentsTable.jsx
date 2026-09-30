import { ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { fadeUp, staggerContainer } from "../../../../Animations/animations";
import StudentStatusBadge from "./StudentStatusBadge";

const students = [
  {
    id: 1,
    name: "Anirban Das",
    roll: "JGEC/CSE/2023/041",
    department: "Computer Science & Engineering",
    email: "anirban.das@example.com",
    year: "4th Year",
    status: "Active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    roll: "JGEC/EE/2023/018",
    department: "Electrical Engineering",
    email: "priya.sharma@example.com",
    year: "4th Year",
    status: "Active",
  },
  {
    id: 3,
    name: "Rahul Roy",
    roll: "JGEC/ME/2023/067",
    department: "Mechanical Engineering",
    email: "rahul.roy@example.com",
    year: "4th Year",
    status: "Active",
  },
  {
    id: 4,
    name: "Sneha Ghosh",
    roll: "JGEC/IT/2023/029",
    department: "Information Technology",
    email: "sneha.ghosh@example.com",
    year: "4th Year",
    status: "Active",
  },
  {
    id: 5,
    name: "Arjun Roy",
    roll: "JGEC/CSE/2022/056",
    department: "Computer Science & Engineering",
    email: "arjun.roy@example.com",
    year: "Graduated",
    status: "Graduated",
  },
];

const getInitials = (name) => {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
};

const StudentsTable = () => {
  return (
    <Card className="overflow-hidden border-border bg-white shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-border p-4 sm:p-5">
        <div>
          <p className="text-sm font-semibold text-ink">Registered Students</p>

          <p className="mt-1 text-xs text-ink-muted">
            Student records registered in the internship portal
          </p>
        </div>

        <span className="hidden rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-700 sm:inline-flex">
          1,248 students
        </span>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-212.5">
          <thead>
            <tr className="border-b border-border bg-cream-soft text-left">
              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Student
              </th>

              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Department
              </th>

              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Year
              </th>

              <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
                Status
              </th>

              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>

          <motion.tbody
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border"
          >
            {students.map((student) => (
              <motion.tr
                key={student.id}
                variants={fadeUp}
                className="transition-colors hover:bg-cream-soft"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                      {getInitials(student.name)}
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {student.name}
                      </p>

                      <p className="mt-0.5 text-xs text-ink-muted">
                        {student.roll}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <p className="max-w-xs truncate text-sm text-ink">
                    {student.department}
                  </p>

                  <p className="mt-0.5 max-w-xs truncate text-xs text-ink-muted">
                    {student.email}
                  </p>
                </td>

                <td className="px-5 py-4 text-sm text-ink-muted">
                  {student.year}
                </td>

                <td className="px-5 py-4">
                  <StudentStatusBadge status={student.status} />
                </td>

                <td className="px-4 py-4">
                  <button
                    type="button"
                    aria-label={`View ${student.name}`}
                    className="rounded-lg p-2 text-ink-muted transition hover:bg-cream hover:text-ink"
                  >
                    <ChevronRight size={17} strokeWidth={1.8} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="divide-y divide-border md:hidden"
      >
        {students.map((student) => (
          <motion.div key={student.id} variants={fadeUp} className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                {getInitials(student.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {student.name}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-ink-muted">
                      {student.roll}
                    </p>
                  </div>

                  <StudentStatusBadge status={student.status} />
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-xs text-ink">{student.department}</p>

                  <p className="text-xs text-ink-muted">{student.email}</p>

                  <p className="text-xs text-ink-muted">{student.year}</p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`More options for ${student.name}`}
                className="rounded-lg p-1.5 text-ink-muted hover:bg-cream hover:text-ink"
              >
                <MoreHorizontal size={17} strokeWidth={1.8} />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <p className="text-xs text-ink-muted">
          Showing <span className="font-medium text-ink">1–5</span> of{" "}
          <span className="font-medium text-ink">1,248</span> students
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-muted opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            className="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white"
          >
            1
          </button>

          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-cream"
          >
            2
          </button>

          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-cream"
          >
            3
          </button>

          <button
            type="button"
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink hover:bg-cream"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
};

export default StudentsTable;
