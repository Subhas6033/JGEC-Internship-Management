import {
  Building2,
  ChevronRight,
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

const actions = [
  {
    title: "Manage students",
    description: "Review registered students",
    icon: GraduationCap,
  },
  {
    title: "Manage companies",
    description: "Review company accounts",
    icon: Building2,
  },
  {
    title: "Review approvals",
    description: "Handle pending requests",
    icon: ShieldCheck,
  },
];

const QuickActions = () => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <Card className="border-border bg-white shadow-card">
        <div className="border-b border-border p-4 sm:p-5">
          <p className="text-sm font-semibold text-ink">Quick Actions</p>

          <p className="mt-1 text-xs text-ink-muted">
            Common administrative tasks
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-1 p-3 sm:p-4"
        >
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <motion.button
                key={action.title}
                variants={fadeUp}
                type="button"
                className="group flex items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-cream"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon size={18} strokeWidth={1.8} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-ink">
                    {action.title}
                  </span>

                  <span className="mt-0.5 block text-xs text-ink-muted">
                    {action.description}
                  </span>
                </span>

                <ChevronRight
                  size={16}
                  strokeWidth={1.8}
                  className="shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5"
                />
              </motion.button>
            );
          })}
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default QuickActions;
