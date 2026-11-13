import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "../../../../Components/index";
import {
  hoverLiftSmall,
  tapScaleSmall,
} from "../../../../Animations/animations";
import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { InfoTooltip } from "./ApplicationTooltip";

const formatDate = (date) => {
  if (!date) return "Date unavailable";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ApplicationListItem = ({ application, selected, onSelect }) => {
  const applicationId =
    application?._id || application?.id || application?.__id;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(application)}
      whileHover={hoverLiftSmall}
      whileTap={tapScaleSmall}
      className="
        group
        relative
        z-0
        w-full
        overflow-visible
        rounded-xl
        text-left
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-brand-700
        focus-visible:ring-offset-2
        hover:z-30
        focus-within:z-30
      "
    >
      <Card
        className={`
          relative
          overflow-visible
          border
          bg-cream-soft
          p-4
          shadow-card
          transition-all
          duration-150
          ${
            selected
              ? "z-10 border-brand-700 ring-1 ring-brand-700/20 shadow-card-hover"
              : "border-border hover:border-brand-700/50 hover:shadow-card-hover"
          }
        `}
      >
        <div className="flex gap-3">
          {/* Company Icon */}
          <div
            className={`
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              transition-colors
              ${
                selected
                  ? "bg-brand-700 text-white"
                  : "bg-brand-50 text-brand-700"
              }
            `}
          >
            <Building2 size={18} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Top Row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                {/* Company Name and Tooltip */}
                <div className="flex min-w-0 items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {application?.company ||
                      application?.organisation?.name ||
                      "Unknown Organisation"}
                  </h3>

                  <InfoTooltip
                    content={`Application ID: ${
                      applicationId || "Unavailable"
                    }`}
                  />
                </div>

                {/* Role */}
                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {application?.role ||
                    application?.designation ||
                    "Internship"}
                </p>
              </div>

              {/* Application Status */}
              <ApplicationStatusBadge status={application?.status} />
            </div>

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} strokeWidth={1.8} />
                {application?.location || "Not specified"}
              </span>

              <span className="capitalize">
                {application?.mode || "Not specified"}
              </span>

              <span>Applied {formatDate(application?.submittedAt)}</span>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] font-medium text-ink-muted">
                View application progress
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className={`
                  transition-colors
                  ${
                    selected
                      ? "text-brand-700"
                      : "text-ink-muted group-hover:text-brand-700"
                  }
                `}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.button>
  );
};

export default ApplicationListItem;
