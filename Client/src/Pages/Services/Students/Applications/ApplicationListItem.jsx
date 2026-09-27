import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { motion } from "motion/react";

import { Card } from "../../../../Components/index";
import {
  hoverLiftSmall,
  tapScaleSmall,
} from "../../../../Animations/animations";

import ApplicationStatusBadge from "./ApplicationStatusBadge";
import { InfoTooltip } from "./ApplicationTooltip";

const ApplicationListItem = ({ application, selected, onSelect }) => {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(application)}
      whileHover={hoverLiftSmall}
      whileTap={tapScaleSmall}
      className="w-full text-left"
    >
      <Card
        className={`
          border
          bg-cream-soft
          p-4
          shadow-card
          transition-all
          duration-150
          ${
            selected
              ? "border-brand-500 ring-1 ring-brand-500/20"
              : "border-border hover:border-brand-300 hover:shadow-card-hover"
          }
        `}
      >
        <div className="flex gap-3">
          {/* Company icon */}
          <div
            className="
              flex
              size-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              bg-brand-50
              text-brand-700
            "
          >
            <Building2 size={18} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            {/* Top row */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-ink">
                    {application.company}
                  </h3>

                  <InfoTooltip content={`Application ID: ${application.id}`} />
                </div>

                <p className="mt-0.5 truncate text-xs text-ink-muted">
                  {application.role}
                </p>
              </div>

              <ApplicationStatusBadge status={application.status} />
            </div>

            {/* Meta */}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={13} strokeWidth={1.8} />
                {application.location}
              </span>

              <span>{application.mode}</span>

              <span>Applied {application.submittedAt}</span>
            </div>

            {/* Footer */}
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-[11px] font-medium text-ink-muted">
                View application progress
              </span>

              <ArrowUpRight
                size={15}
                strokeWidth={1.8}
                className={selected ? "text-brand-700" : "text-ink-muted"}
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.button>
  );
};

export default ApplicationListItem;
