import { motion } from "framer-motion";
import { fadeUp } from "../../../../Animations/animations";

const NocSection = ({ title, description, meta, children }) => (
  <motion.section variants={fadeUp} className="mt-6 w-full min-w-0 sm:mt-8">
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-lg font-bold leading-tight text-ink sm:text-xl">
          {title}
        </h2>
        <p className="mt-1 text-xs leading-5 text-ink-muted sm:text-sm">
          {description}
        </p>
      </div>

      <p className="shrink-0 text-xs font-medium text-ink-muted">{meta}</p>
    </div>

    <div className="mt-4">{children}</div>
  </motion.section>
);

export default NocSection;
