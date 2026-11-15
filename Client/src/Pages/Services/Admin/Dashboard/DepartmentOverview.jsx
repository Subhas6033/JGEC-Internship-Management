import { motion, useReducedMotion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import {
  staggerFast,
  fadeUp,
  transitions,
  viewportEarly,
} from "../../../../Animations/animations";

// Observe the TRACK (it has real size), not the fill: an element scaled to 0
// has no area, so IntersectionObserver never reports it as visible and the
// fill would stay invisible.
const fillVariants = {
  idle: { scaleX: 0 },
  filled: { scaleX: 1, transition: transitions.smooth },
};

const ProgressBar = ({ percentage, label }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 overflow-hidden rounded-full bg-brand-50"
      {...(reduce
        ? {}
        : { initial: "idle", whileInView: "filled", viewport: viewportEarly })}
    >
      <motion.div
        className="h-full rounded-full bg-brand-700"
        style={{ width: `${percentage}%`, originX: 0 }}
        variants={reduce ? undefined : fillVariants}
      />
    </motion.div>
  );
};

const DepartmentOverview = ({ data = [] }) => {
  const departments = Array.isArray(data) ? data : [];

  return (
    <Card>
      <Card.Header>
        <Card.Title>Department Performance</Card.Title>
        <p className="text-sm text-ink-muted">
          Student participation and selections
        </p>
      </Card.Header>

      <Card.Content>
        {departments.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">
            No department data available.
          </p>
        ) : (
          <Reveal variants={staggerFast} className="space-y-5">
            {departments.map((department, index) => {
              const students = Number(department.students || 0);
              const selected = Number(department.selected || 0);
              const percentage =
                students > 0
                  ? Math.min(100, Math.round((selected / students) * 100))
                  : 0;
              const name = department.name || "Unknown department";

              return (
                <Item key={`${name}-${index}`} variants={fadeUp}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-ink">
                      {name}
                    </p>
                    <p className="shrink-0 text-xs text-ink-muted">
                      {selected}/{students}
                    </p>
                  </div>

                  <ProgressBar
                    percentage={percentage}
                    label={`${name}: ${percentage}% selected`}
                  />

                  <p className="mt-1 text-right text-[11px] text-ink-muted">
                    {percentage}% selected
                  </p>
                </Item>
              );
            })}
          </Reveal>
        )}
      </Card.Content>
    </Card>
  );
};

export default DepartmentOverview;
