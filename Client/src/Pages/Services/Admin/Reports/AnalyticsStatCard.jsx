import { motion } from "framer-motion";
import {
  Users,
  FileText,
  TrendingUp,
  BriefcaseBusiness,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "../../../../Components/index";

import {
  cardAnimation,
  hoverLiftSmall,
  useAnimationVariants,
} from "../../../../Animations/animations";

const iconMap = {
  students: Users,
  applications: FileText,
  placement: TrendingUp,
  drives: BriefcaseBusiness,
};

const AnalyticsStatCard = ({ stat, index = 0 }) => {
  const Icon = iconMap[stat.icon] || FileText;
  const animation = useAnimationVariants(cardAnimation);

  return (
    <motion.div
      custom={index}
      variants={animation}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={hoverLiftSmall}
      className="h-full min-w-0"
    >
      <Card className="h-full border border-border bg-white p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-ink">
              {stat.value}
              {stat.suffix || ""}
            </h3>
          </div>

          <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <Icon size={21} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
            <ArrowUpRight size={14} />
            {stat.change}
          </span>

          <span className="text-xs text-ink-muted">{stat.description}</span>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalyticsStatCard;
