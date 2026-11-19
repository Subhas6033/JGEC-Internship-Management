import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const NocStatCard = ({ icon: Icon, label, value, helper, loading }) => {
  if (loading) {
    return (
      <motion.div variants={fadeUp} className="min-w-0">
        <Card className="border-border bg-surface shadow-(--shadow-card)">
          <Card.Content className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <div className="h-4 w-14 animate-pulse rounded bg-ink-muted/15" />
                <div className="h-7 w-10 animate-pulse rounded bg-ink-muted/15" />
                <div className="h-3 w-20 animate-pulse rounded bg-ink-muted/15" />
              </div>

              <div className="size-10 shrink-0 animate-pulse rounded-lg bg-ink-muted/15" />
            </div>
          </Card.Content>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <Card className="border-border bg-surface shadow-(--shadow-card) transition-shadow duration-200 hover:shadow-(--shadow-card-hover)">
        <Card.Content className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium text-ink-muted sm:text-sm">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
                {value}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{helper}</p>
            </div>

            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700 transition-transform duration-200 group-hover:scale-105">
              <Icon size={19} aria-hidden="true" />
            </span>
          </div>
        </Card.Content>
      </Card>
    </motion.div>
  );
};

export default NocStatCard;
