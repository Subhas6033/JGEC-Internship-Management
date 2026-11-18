import { motion } from "framer-motion";
import { Users, FileCheck, Building2, GraduationCap } from "lucide-react";
import { Card } from "../../../../Components/index";

const iconMap = {
  users: Users,
  "file-check": FileCheck,
  "building-2": Building2,
  "graduation-cap": GraduationCap,
};

const StudentStatCard = ({ stat, index = 0 }) => {
  const Icon = iconMap[stat.icon] || Users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.07,
      }}
      whileHover={{ y: -4 }}
    >
      <Card className="border-border bg-cream-soft p-5 shadow-card transition-shadow hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

            <motion.h3
              key={stat.value}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-2xl font-bold text-ink"
            >
              {stat.value}
            </motion.h3>

            <p className="mt-1 text-xs text-ink-muted">{stat.description}</p>
          </div>

          <div className="rounded-xl bg-white p-3 text-brand-600">
            <Icon size={21} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StudentStatCard;
