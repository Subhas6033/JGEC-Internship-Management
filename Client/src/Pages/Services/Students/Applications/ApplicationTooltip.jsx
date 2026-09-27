import { Info } from "lucide-react";

const ApplicationTooltip = ({ children, content }) => {
  return (
    <span className="group relative inline-flex">
      {children}

      <span
        role="tooltip"
        className="
          pointer-events-none
          absolute
          bottom-full
          left-1/2
          z-50
          mb-2
          w-max
          max-w-60
          -translate-x-1/2
          rounded-md
          border
          border-border
          bg-ink
          px-3
          py-2
          text-xs
          leading-5
          text-cream
          opacity-0
          shadow-card-hover
          transition-opacity
          duration-150
          group-hover:opacity-100
          group-focus-within:opacity-100
        "
      >
        {content}

        <span
          className="
            absolute
            left-1/2
            top-full
            -translate-x-1/2
            border-4
            border-transparent
            border-t-ink
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
