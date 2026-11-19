import { motion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

const NocStatCard = ({ icon: Icon, label, value, helper }) => (
  <motion.div variants={fadeUp} className="min-w-0">
    <Card className="border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-ink-muted sm:text-sm">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
            <p className="mt-1 text-xs text-ink-muted">{helper}</p>
          </div>

          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
            <Icon size={19} aria-hidden="true" />
          </span>
        </div>
      </Card.Content>
    </Card>
  </motion.div>
);

export default NocStatCard;
