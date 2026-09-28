import { Bell, ChevronDown, Menu, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

const SPOCNavbar = ({ onMenuClick }) => {
  return (
    <header
      className="
        sticky top-0 z-40
        border-b border-border
        bg-cream/90
        backdrop-blur-md
      "
    >
      <nav
        aria-label="SPOC navigation"
        className="
          mx-auto flex min-h-16 w-full max-w-auto
          items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* Left side */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="
    focus-ring
    rounded-lg p-2
    text-ink-muted
    transition-colors duration-200
    hover:bg-cream-dark
    hover:text-ink
    lg:hidden
  "
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Right actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              focus-ring
              relative rounded-lg p-2.5
              text-ink-muted
              transition-colors duration-200
              hover:bg-cream-dark
              hover:text-brand-700
            "
          >
            <Bell size={19} strokeWidth={2} />

            <span
              aria-hidden="true"
              className="
                absolute right-2 top-2
                size-1.5 rounded-full
                bg-brand-600
                ring-2 ring-cream-soft
              "
            />
          </button>

          {/* Profile */}
          <div className="ml-1 border-l border-border pl-2 sm:pl-3">
            <button
              type="button"
              aria-label="Open SPOC account menu"
              className="
                focus-ring group
                flex items-center gap-2
                rounded-lg p-1.5
                transition-colors duration-200
                hover:bg-cream-dark
              "
            >
              {/* User information */}
              <span className="hidden text-right sm:block">
                <span className="block text-sm font-semibold leading-tight text-ink">
                  SPOC
                </span>

                <span className="mt-0.5 block text-[11px] leading-tight text-ink-muted">
                  Training & Placement
                </span>
              </span>

              {/* Avatar */}
              <span
                className="
                  flex size-9 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-brand-100
                  text-brand-700
                  transition-colors
                  group-hover:bg-brand-200
                "
              >
                <UserRound size={17} />
              </span>

              <ChevronDown
                size={15}
                className="
                  hidden
                  text-ink-muted
                  transition-transform
                  group-hover:text-ink
                  sm:block
                "
              />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SPOCNavbar;
