import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileCheck2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "../../../../Components";
import {
  staggerFast,
  sectionAnimation,
  useAnimationVariants,
} from "../../../../Animations/animations";

const TONES = {
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
  orange: "bg-orange-50 text-orange-700",
  emerald: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  neutral: "bg-cream-dark text-ink",
};

// KPI strip only — the visual breakdowns live in the charts below.
const TpoApplicationStats = ({ statistics = {}, loading = false }) => {
  const gridVariants = useAnimationVariants(staggerFast);
  const itemVariants = useAnimationVariants(sectionAnimation);

  const stats = [
    {
      label: "Total applications",
      value: statistics.total ?? 0,
      icon: ClipboardList,
      tone: "neutral",
    },
    {
      label: "Pending review",
      value: (statistics.submitted ?? 0) + (statistics.underTpoReview ?? 0),
      icon: Clock3,
      tone: "amber",
    },
    {
      label: "Approved by TPO",
      value: statistics.approvedByTpo ?? 0,
      icon: CheckCircle2,
      tone: "emerald",
    },
    {
      label: "Approved by SPOC",
      value: statistics.approvedBySpoc ?? 0,
      icon: FileCheck2,
      tone: "blue",
    },
    {
      label: "Rejected",
      value: statistics.rejected ?? 0,
      icon: XCircle,
      tone: "red",
    },
    {
      label: "Update required",
      value: statistics.updateRequired ?? 0,
      icon: RotateCcw,
      tone: "orange",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 @2xl:grid-cols-3 @6xl:grid-cols-6"
      variants={gridVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <motion.div key={item.label} variants={itemVariants}>
            <Card className="h-full rounded-xl border border-border bg-cream-soft p-0 shadow-sm">
              <div className="flex items-center justify-between gap-3 p-3 sm:p-4">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-ink-muted">
                    {item.label}
                  </p>
                  {loading ? (
                    <span className="mt-2 block h-7 w-12 animate-pulse rounded bg-cream-dark" />
                  ) : (
                    <p className="mt-1.5 text-xl font-semibold tabular-nums tracking-tight text-ink sm:text-2xl">
                      {item.value}
                    </p>
                  )}
                </div>
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg sm:size-9 ${TONES[item.tone]}`}
                >
                  <Icon
                    className="h-4.25 w-4.25"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TpoApplicationStats;
