import { FileSearch } from "lucide-react";
import { motion } from "motion/react";

import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

import ApplicationListItem from "./ApplicationListItem";

const ApplicationList = ({ applications, selectedApplication, onSelect }) => {
  if (!applications.length) {
    return (
      <div
        className="
          flex
          min-h-80
          flex-col
          items-center
          justify-center
          rounded-xl
          border
          border-dashed
          border-border
          bg-cream-soft
          px-6
          text-center
        "
      >
        <div
          className="
            flex
            size-12
            items-center
            justify-center
            rounded-full
            bg-cream-dark
            text-ink-muted
          "
        >
          <FileSearch size={21} strokeWidth={1.7} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-ink">
          No applications found
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-ink-muted">
          Try changing your search or filters to find another application.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-3"
    >
      {applications.map((application) => (
        <motion.div key={application.id} variants={cardAnimation}>
          <ApplicationListItem
            application={application}
            selected={selectedApplication?.id === application.id}
            onSelect={onSelect}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ApplicationList;
