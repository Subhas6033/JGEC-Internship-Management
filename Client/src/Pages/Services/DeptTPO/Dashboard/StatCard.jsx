import { Card } from "../../../../Components";
import { cardAnimation } from "../../../../Animations/animations";
import { motion } from "motion/react";

const toneStyles = {
  brand: {
    wrapper: "bg-brand-50 text-brand-700",
    icon: "text-brand-700",
  },

  success: {
    wrapper: "bg-brand-50 text-success",
    icon: "text-success",
  },

  warning: {
    wrapper: "bg-amber-50 text-warning",
    icon: "text-warning",
  },

  info: {
    wrapper: "bg-sky-50 text-info",
    icon: "text-info",
  },
};

const StatCard = ({
  label,
  value,
  description,
  icon: Icon,
  tone = "brand",
}) => {
  const styles = toneStyles[tone] ?? toneStyles.brand;

  return (
    <motion.div
      variants={cardAnimation}
      whileHover={{
        y: -2,
      }}
    >
      <Card
        className="
          border-border
          bg-cream-soft
          p-5
          shadow-card
          transition-shadow
          duration-200
          hover:shadow-card-hover
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-ink-muted">{label}</p>

            <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
              {value}
            </p>

            <p className="mt-1 text-xs leading-5 text-ink-muted">
              {description}
            </p>
          </div>

          <div
            className={`
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              ${styles.wrapper}
            `}
          >
            <Icon size={19} strokeWidth={1.8} className={styles.icon} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard;
