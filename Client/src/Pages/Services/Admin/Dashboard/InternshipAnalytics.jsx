import { motion, useReducedMotion } from "framer-motion";
import { Card } from "../../../../Components/index";
import { transitions, viewportEarly } from "../../../../Animations/animations";

const Bar = ({ value, max, index, label, className }) => {
  const reduce = useReducedMotion();
  const height = `${(value / max) * 100}%`;

  const motionProps = reduce
    ? { style: { height } }
    : {
        initial: { height: "0%" },
        whileInView: { height },
        viewport: viewportEarly,
        transition: { ...transitions.smooth, delay: index * 0.04 },
      };

  return (
    <motion.div
      title={label}
      className={`w-2/5 max-w-6 rounded-t-sm transition-opacity hover:opacity-75 ${className}`}
      {...motionProps}
      style={{ ...motionProps.style, minHeight: value > 0 ? "3px" : "0" }}
    />
  );
};

const InternshipAnalytics = ({ data = [] }) => {
  const analytics = Array.isArray(data) ? data : [];

  const maxValue = Math.max(
    1,
    ...analytics.flatMap((i) => [
      Number(i.applications || 0),
      Number(i.selections || 0),
    ]),
  );
  const totalApplications = analytics.reduce(
    (t, i) => t + Number(i.applications || 0),
    0,
  );
  const totalSelections = analytics.reduce(
    (t, i) => t + Number(i.selections || 0),
    0,
  );

  // Only add the year to labels when the data spans more than one year.
  const multiYear = new Set(analytics.map((i) => i.year)).size > 1;
  const monthLabel = (i) =>
    multiYear && i.year ? `${i.month} ’${String(i.year).slice(-2)}` : i.month;

  return (
    <Card>
      <Card.Header className="flex flex-row flex-wrap items-start justify-between gap-3">
        <div>
          <Card.Title>Internship Overview</Card.Title>
          <p className="mt-1 text-sm text-ink-muted">
            Monthly applications and student selections
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full bg-brand-700"
              aria-hidden="true"
            />
            Applications
          </div>
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full bg-brand-300"
              aria-hidden="true"
            />
            Selections
          </div>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="mb-6 flex items-end gap-8">
          <div>
            <p className="text-xs text-ink-muted">Total applications</p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {totalApplications.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-muted">Total selections</p>
            <p className="mt-1 text-2xl font-semibold text-ink">
              {totalSelections.toLocaleString()}
            </p>
          </div>
        </div>

        {analytics.length === 0 ? (
          <div className="flex h-64 items-center justify-center rounded-xl bg-cream-soft/50">
            <p className="text-sm text-ink-muted">
              No internship analytics available for this period.
            </p>
          </div>
        ) : (
          <div
            role="img"
            aria-label={`Bar chart of monthly applications and selections: ${totalApplications} applications, ${totalSelections} selections in total.`}
            className="flex h-64 items-end gap-2 overflow-x-auto border-b border-border pb-2 sm:gap-4"
          >
            {analytics.map((item, index) => {
              const applications = Number(item.applications || 0);
              const selections = Number(item.selections || 0);

              return (
                <div
                  key={`${item.year}-${item.month}-${index}`}
                  className="flex h-full min-w-8.75 flex-1 flex-col justify-end"
                >
                  <div className="flex h-full items-end justify-center gap-1">
                    <Bar
                      value={applications}
                      max={maxValue}
                      index={index}
                      className="bg-brand-700"
                      label={`${applications} applications`}
                    />
                    <Bar
                      value={selections}
                      max={maxValue}
                      index={index}
                      className="bg-brand-300"
                      label={`${selections} selections`}
                    />
                  </div>

                  <span className="mt-3 whitespace-nowrap text-center text-[10px] text-ink-muted sm:text-xs">
                    {monthLabel(item)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default InternshipAnalytics;
