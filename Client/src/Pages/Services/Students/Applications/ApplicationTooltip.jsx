import { Info } from "lucide-react";

const ApplicationTooltip = ({ children, content }) => {
  return (
    <span className="group relative z-20 inline-flex overflow-visible">
      {children}

      {/* Tooltip */}
      <span
        role="tooltip"
        className="
          pointer-events-none
          absolute
          left-0
          top-full
          z-100
          mt-2
          w-max
          min-w-48
          max-w-64
          rounded-lg
          border
          border-border
          bg-ink
          px-3
          py-2
          text-xs
          leading-5
          text-cream
          opacity-0
          invisible
          shadow-card-hover
          transition-all
          duration-150
          group-hover:visible
          group-hover:opacity-100
          group-focus-within:visible
          group-focus-within:opacity-100
          whitespace-normal
          break-all
        "
      >
        {content}

        {/* Tooltip Arrow */}
        <span
          className="
            absolute
            bottom-full
            left-3
            border-[5px]
            border-transparent
            border-b-ink
          "
          aria-hidden="true"
        />
      </span>
    </span>
  );
};

export const InfoTooltip = ({ content }) => {
  return (
    <ApplicationTooltip content={content}>
      <button
        type="button"
        aria-label="More information"
        className="
          focus-ring
          inline-flex
          size-5
          shrink-0
          items-center
          justify-center
          rounded-full
          text-ink-muted
          transition-colors
          hover:text-brand-700
        "
      >
        <Info size={14} strokeWidth={1.8} />
      </button>
    </ApplicationTooltip>
  );
};

export default ApplicationTooltip;
