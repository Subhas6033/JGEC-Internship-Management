import {
  Building2,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
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
    change: "+8.4%",
    description: "from last month",
    icon: GraduationCap,
  },
  {
    title: "Registered Companies",
    value: "86",
    change: "+5.2%",
    description: "from last month",
    icon: Building2,
  },
  {
    title: "Active Applications",
    value: "324",
    change: "+12.6%",
    description: "from last month",
    icon: ClipboardCheck,
  },
  {
    title: "Pending Approvals",
    value: "18",
    change: "Needs review",
    description: "department requests",
    icon: ShieldCheck,
  },
];

const StatCard = ({ title, value, change, description, icon: Icon }) => {
  const needsReview = change === "Needs review";

  return (
    <motion.div variants={fadeUp}>
      <Card className="h-full border-border bg-white shadow-card transition-shadow hover:shadow-card-hover">
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-muted">{title}</p>

              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {value}
              </p>
            </div>

            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
              <Icon size={19} strokeWidth={1.8} />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
            <span
              className={
                needsReview
                  ? "font-semibold text-amber-700"
                  : "font-semibold text-brand-700"
              }
            >
              {change}
            </span>

            <span className="text-ink-muted">{description}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const DashboardStats = () => {
  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      aria-label="Portal statistics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </motion.section>
  );
};

export default DashboardStats;
