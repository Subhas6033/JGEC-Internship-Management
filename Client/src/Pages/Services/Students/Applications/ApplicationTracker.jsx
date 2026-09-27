import { Check, Clock3, FileText, MapPin } from "lucide-react";
import { motion } from "motion/react";

import { Card } from "../../../../Components/index";
import { fadeUp } from "../../../../Animations/animations";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { InfoTooltip } from "./ApplicationTooltip";

const ApplicationTracker = ({ application }) => {
  if (!application) {
    return (
      <Card
        className="
          flex
          min-h-96
          items-center
          justify-center
          border-border
          bg-cream-soft
          p-6
          text-center
          shadow-card
        "
      >
        <div>
          <div
            className="
              mx-auto
              flex
              size-12
              items-center
              justify-center
              rounded-full
              bg-cream-dark
              text-ink-muted
            "
          >
            <FileText size={21} strokeWidth={1.7} />
          </div>

          <p className="mt-4 text-sm font-semibold text-ink">
            Select an application
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Select an application from the list to view its progress.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      key={application.id}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <Card
        className="
          border-border
          bg-cream-soft
          p-5
          shadow-card
          lg:sticky
          lg:top-6
        "
      >
        {/* Header */}
        <div className="border-b border-border pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">Application tracking</p>

              <h2 className="mt-2 font-display text-2xl tracking-tight text-ink">
                {application.company}
              </h2>

              <p className="mt-1 text-sm text-ink-muted">{application.role}</p>
            </div>

            <InfoTooltip content={`Application ID: ${application.id}`} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <ApplicationStatusBadge status={application.status} />

            <span className="text-xs text-ink-muted">
              Applied {application.submittedAt}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} strokeWidth={1.8} />
              {application.location}
            </span>

            <span>{application.mode}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="pt-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">
              Application progress
            </h3>

            <InfoTooltip content="Your application progresses through verification, department review and final decision." />
          </div>

          <div className="mt-5">
            {application.timeline.map((item, index) => {
              const isLast = index === application.timeline.length - 1;

              return (
                <div key={item.title} className="relative flex gap-3">
                  {/* Vertical line */}
                  {!isLast && (
                    <span
                      className={`
                        absolute
                        left-2.75
                        top-7
                        h-[calc(100%-8px)]
                        w-px
                        ${item.completed ? "bg-brand-300" : "bg-border"}
                      `}
                      aria-hidden="true"
                    />
                  )}

                  {/* Step icon */}
                  <div
                    className={`
                      relative
                      z-10
                      flex
                      size-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      ${
                        item.completed
                          ? item.current
                            ? "border-brand-700 bg-brand-700 text-white"
                            : "border-brand-300 bg-brand-50 text-brand-700"
                          : "border-border bg-cream text-ink-muted"
                      }
                    `}
                  >
                    {item.completed ? (
                      <Check size={13} strokeWidth={2.2} />
                    ) : (
                      <Clock3 size={12} strokeWidth={1.8} />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`min-w-0 flex-1 ${isLast ? "" : "pb-6"}`}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p
                          className={`
                            text-sm font-semibold
                            ${item.current ? "text-brand-700" : "text-ink"}
                          `}
                        >
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-ink-muted">
                          {item.description}
                        </p>
                      </div>

                      {item.date && (
                        <span className="shrink-0 text-[11px] text-ink-muted">
                          {item.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ApplicationTracker;
