import { CheckCircle2, GraduationCap, UserCheck, Users } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../Animations/animations";

const stats = [
  {
    title: "Total Students",
    value: "1,248",
    description: "Registered students",
    icon: Users,
  },
  {
    title: "Active Students",
    value: "1,164",
    description: "Currently active",
    icon: UserCheck,
  },
  {
    title: "Internship Ready",
    value: "842",
    description: "Eligible for internship",
    icon: GraduationCap,
  },
  {
    title: "Completed",
    value: "326",
    description: "Internships completed",
    icon: CheckCircle2,
  },
];

const StatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <motion.div variants={fadeUp}>
      <Card className="h-full border-border bg-white shadow-card transition-shadow hover:shadow-card-hover">
        <div className="flex items-start justify-between gap-4 p-4 sm:p-5">
          <div>
            <p className="text-xs font-medium text-ink-muted">{title}</p>

            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {value}
            </p>

            <p className="mt-2 text-xs text-ink-muted">{description}</p>
          </div>

          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <Icon size={19} strokeWidth={1.8} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const StudentStats = () => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      aria-label="Student statistics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </motion.section>
  );
};

export default StudentStats;
