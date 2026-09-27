import { ClipboardCheck, Clock3, FileCheck2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { dashboardStats } from "./dashboard.data";

const iconMap = {
  file: FileText,
  clock: Clock3,
  approved: ClipboardCheck,
  documents: FileCheck2,
};

const DashboardStats = () => {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      initial="hidden"
      animate="visible"
    >
      {dashboardStats.map((stat, index) => {
        const Icon = iconMap[stat.icon];

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="border-border bg-cream-soft p-5 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-ink-muted">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold text-ink">
                    {stat.value}
                  </p>
                </div>

                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon size={18} strokeWidth={1.8} />
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default DashboardStats;
