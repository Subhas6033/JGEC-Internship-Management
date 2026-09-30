import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components/index";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../Animations/animations";

const recentApplications = [
  {
    id: 1,
    student: "Anirban Das",
    department: "Computer Science & Engineering",
    company: "TCS",
    status: "Pending",
  },
  {
    id: 2,
    student: "Priya Sharma",
    department: "Electrical Engineering",
    company: "Infosys",
    status: "Approved",
  },
  {
    id: 3,
    student: "Rahul Roy",
    department: "Mechanical Engineering",
    company: "Cognizant",
    status: "Pending",
  },
  {
    id: 4,
    student: "Sneha Ghosh",
    department: "Information Technology",
    company: "Wipro",
    status: "Approved",
  },
];

const StatusBadge = ({ status }) => {
  const isApproved = status === "Approved";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1",
        "text-[11px] font-semibold",
        isApproved
          ? "bg-brand-50 text-brand-700"
          : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {status}
    </span>
  );
};

const RecentApplications = () => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <Card className="border-border bg-white shadow-card">
        <div className="flex items-center justify-between gap-4 border-b border-border p-4 sm:p-5">
          <div>
            <p className="text-sm font-semibold text-ink">
              Recent Applications
            </p>

            <p className="mt-1 text-xs text-ink-muted">
              Latest internship application activity
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-brand-700 hover:bg-brand-50"
          >
            View all
            <ArrowRight size={14} strokeWidth={1.8} />
          </Button>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="divide-y divide-border"
        >
          {recentApplications.map((application) => (
            <motion.div
              key={application.id}
              variants={fadeUp}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                  {application.student
                    .split(" ")
                    .map((name) => name[0])
                    .join("")
                    .slice(0, 2)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">
                    {application.student}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {application.department}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="text-xs font-medium text-ink">
                    {application.company}
                  </p>

                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    Internship application
                  </p>
                </div>

                <StatusBadge status={application.status} />

                <button
                  type="button"
                  aria-label={`View ${application.student}`}
                  className="rounded-md p-1.5 text-ink-muted transition hover:bg-cream hover:text-ink"
                >
                  <ChevronRight size={16} strokeWidth={1.8} />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default RecentApplications;
