import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button, Card } from "../../../../Components/index";
import {
  fadeUp,
  staggerContainer,
  viewport,
} from "../../../../Animations/animations";

const activities = [
  {
    id: 1,
    title: "New company registration",
    description: "Tech Mahindra submitted a registration request.",
    time: "12 min ago",
    icon: Building2,
  },
  {
    id: 2,
    title: "Department approval completed",
    description: "CSE department approved 14 internship applications.",
    time: "45 min ago",
    icon: CheckCircle2,
  },
  {
    id: 3,
    title: "New student registrations",
    description: "32 students completed their portal registration.",
    time: "2 hrs ago",
    icon: Users,
  },
];

const ActivityCard = () => {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <Card className="border-border bg-white shadow-card">
        <div className="border-b border-border p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <Activity size={17} className="text-brand-700" strokeWidth={1.8} />

            <p className="text-sm font-semibold text-ink">Recent Activity</p>
          </div>

          <p className="mt-1 text-xs text-ink-muted">
            System activity across the portal
          </p>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="p-4 sm:p-5"
        >
          <div className="space-y-5">
            {activities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <motion.div
                  key={activity.id}
                  variants={fadeUp}
                  className="flex gap-3"
                >
                  <div className="relative">
                    <div className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                      <Icon size={16} strokeWidth={1.8} />
                    </div>

                    {index !== activities.length - 1 && (
                      <span className="absolute left-1/2 top-10 h-7 w-px -translate-x-1/2 bg-border" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-ink-muted">
                      {activity.description}
                    </p>

                    <p className="mt-1.5 text-[10px] font-medium text-ink-muted">
                      {activity.time}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-6 w-full border-border text-ink hover:bg-cream"
          >
            View activity log
            <ArrowRight size={14} strokeWidth={1.8} />
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
};

export default ActivityCard;
