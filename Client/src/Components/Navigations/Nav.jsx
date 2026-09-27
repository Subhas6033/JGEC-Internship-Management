import React from "react";
import { Link, NavLink } from "react-router-dom";
import { MoveUpRight } from "lucide-react";

const Nav = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/90 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="
          mx-auto flex min-h-16 w-full max-w-auto
          items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        <Link
          to="/"
          aria-label="Internship NOC - JGEC"
          className="
            focus-ring group
            flex min-w-0 shrink-0
            items-center gap-2.5
            rounded-lg
          "
        >
          {/* Logo */}
          <span
            className="
              flex size-9 shrink-0
              items-center justify-center
              overflow-hidden
              rounded-full
              border border-border
              bg-cream-soft
              p-1
              transition-all duration-200
              group-hover:border-brand-500
              group-hover:shadow-sm
              sm:size-10
              sm:p-1.5
            "
          >
            <img
              src="/jgecLogo.png"
              alt=""
              aria-hidden="true"
              width="40"
              height="40"
              loading="eager"
              decoding="async"
              className="
                block size-full
                object-contain
              "
            />
          </span>

          {/* Brand */}
          <span className="flex min-w-0 flex-col">
            <span
              className="
                truncate
                text-[13px] font-semibold
                leading-tight tracking-[-0.01em]
                text-ink
                sm:text-sm
              "
            >
              Internship NOC
            </span>

            <span
              className="
                mt-0.5 hidden
                truncate
                text-[9px] font-medium
                uppercase tracking-[0.04em]
                leading-tight
                text-ink-muted
                sm:block
              "
            >
              JGEC · Internship Management
            </span>
          </span>
        </Link>

        {/* Navigation Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Login */}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              [
                "focus-ring rounded-lg px-2.5 py-2 sm:px-3",
                "text-xs font-medium sm:text-sm",
                "transition-colors duration-200",
                isActive ? "text-brand-700" : "text-ink-muted hover:text-ink",
              ].join(" ")
            }
          >
            Login
          </NavLink>

          {/* Apply CTA */}
          <Link
            to="/apply"
            className="
              focus-ring
              inline-flex min-h-9
              items-center justify-center
              gap-1.5
              rounded-lg
              bg-brand-700
              px-3
              py-2
              text-xs font-semibold
              text-white
              shadow-sm
              transition-all duration-200
              hover:bg-brand-800
              hover:shadow-md
              active:translate-y-px
              sm:min-h-10
              sm:gap-2
              sm:px-4
              sm:text-sm
            "
          >
            <span>Apply for NOC</span>

            <MoveUpRight
              aria-hidden="true"
              size={14}
              strokeWidth={2}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
