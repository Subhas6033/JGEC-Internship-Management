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
          min-h-85
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-dashed
          border-border
          bg-card
          px-6
          text-center
          shadow-sm
        "
      >
        <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <FileSearch size={21} strokeWidth={1.7} />
        </div>

        <h3 className="mt-4 text-sm font-semibold text-foreground">
          No applications found
        </h3>

        <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
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
        <motion.div
          key={application.id}
          variants={cardAnimation}
          className="min-w-0"
        >
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
