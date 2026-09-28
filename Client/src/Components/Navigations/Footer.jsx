import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Mail, MapPin, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-ink text-cream">
      <div className="mx-auto w-full max-w-auto px-5 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr] md:gap-12">
          <div className="max-w-sm">
            <Link
              to="/"
              aria-label="Internship NOC home"
              className="
                focus-ring group
                inline-flex items-center gap-3
                rounded-lg
              "
            >
              {/* Logo */}
              <span
                className="
                  flex size-10 shrink-0
                  items-center justify-center
                  overflow-hidden
                  rounded-full
                  border border-cream/20
                  bg-cream-soft
                  p-1.5
                  transition-colors duration-200
                  group-hover:border-brand-400
                "
              >
                <img
                  src="/jgecLogo.png"
                  alt=""
                  aria-hidden="true"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                  className="block size-full object-contain"
                />
              </span>

              <span className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-cream">
                  Internship NOC
                </span>

                <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.04em] text-cream/55">
                  JGEC · Internship Management
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-xs leading-5 text-cream/60 sm:text-sm sm:leading-6">
              A streamlined internship approval portal designed to make NOC
              applications simple, traceable, and easier to manage.
            </p>

            {/* Institution */}
            <a
              href="https://jgec.ac.in/"
              target="_blank"
              rel="noreferrer"
              className="
                focus-ring
                mt-5 inline-flex
                items-center gap-1.5
                rounded-md
                text-xs font-medium
                text-cream/75
                transition-colors
                hover:text-brand-300
              "
            >
              <span>Jalpaiguri Government Engineering College</span>

              <ExternalLink aria-hidden="true" size={12} strokeWidth={1.8} />
            </a>
          </div>
          {/* Quick Links */}
          <div>
            <p className="eyebrow text-brand-300!">Navigate</p>

            <nav
              aria-label="Footer navigation"
              className="mt-4 flex flex-col items-start gap-2.5"
            >
              <Link
                to="/"
                className="
                  focus-ring rounded-md
                  text-xs text-cream/65
                  transition-colors
                  hover:text-cream
                "
              >
                Home
              </Link>

              <Link
                to="/students/applications/new"
                className="
                  focus-ring rounded-md
                  text-xs text-cream/65
                  transition-colors
                  hover:text-cream
                "
              >
                Apply for NOC
              </Link>

              <Link
                to="/auth/login"
                className="
                  focus-ring rounded-md
                  text-xs text-cream/65
                  transition-colors
                  hover:text-cream
                "
              >
                Login
              </Link>

              <a
                href="#how-it-works"
                className="
                  focus-ring rounded-md
                  text-xs text-cream/65
                  transition-colors
                  hover:text-cream
                "
              >
                How It Works
              </a>
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <p className="eyebrow text-brand-300!">Need help?</p>

            <div className="mt-4 space-y-4">
              <a
                href="mailto:placement@jgec.ac.in"
                className="
                  focus-ring
                  flex items-start gap-2.5
                  rounded-md
                  text-xs text-cream/65
                  transition-colors
                  hover:text-cream
                "
              >
                <Mail
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-brand-300"
                />

                <span>placement@jgec.ac.in</span>
              </a>

              <div className="flex items-start gap-2.5 text-xs text-cream/65">
                <MapPin
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.7}
                  className="mt-0.5 shrink-0 text-brand-300"
                />

                <span className="leading-5">
                  Jalpaiguri Government Engineering College
                  <br />
                  Jalpaiguri, West Bengal, 735102
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div
          className="
      mx-auto w-full
      px-5 py-5
      sm:px-6 sm:py-5
      lg:px-8
    "
        >
          {/* Copyright + Links */}
          <div
            className="
        mt-3
        flex flex-col
        items-center
        gap-3
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
          >
            {/* Copyright */}
            <p
              className="
          text-center
          text-[10px]
          leading-5
          text-cream/45
          sm:text-left
          sm:text-xs
        "
            >
              © {currentYear} Internship NOC · JGEC. All rights reserved.
            </p>

            {/* Maintainer */}
            <p
              className="
        text-center
        text-[10px]
        font-medium
        leading-5
        tracking-wide
        text-cream/50
        sm:text-xs
      "
            >
              Maintained and developed by{" "}
              <Link
                to="https://subhas.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="
    group
    inline-flex
    items-center
    text-sm
    font-semibold
    tracking-wide
    text-brand-300
    transition-all
    duration-200
    hover:text-brand-200
  "
              >
                <span className="relative">
                  Subhas
                  <span
                    className="
        absolute
        -bottom-0.5
        left-0
        h-px
        w-0
        bg-brand-300
        transition-all
        duration-300
        group-hover:w-full
      "
                  />
                </span>
              </Link>
            </p>

            {/* Footer Links */}
            <div
              className="
          flex
          items-center
          gap-4
        "
            >
              <Link
                to="/privacy"
                className="
            focus-ring
            rounded-md
            text-[10px]
            text-cream/45
            transition-colors
            hover:text-cream/80
            sm:text-xs
          "
              >
                Privacy
              </Link>

              <Link
                to="/terms"
                className="
            focus-ring
            rounded-md
            text-[10px]
            text-cream/45
            transition-colors
            hover:text-cream/80
            sm:text-xs
          "
              >
                Terms
              </Link>

              <a
                href="#top"
                className="
            focus-ring
            inline-flex
            items-center
            gap-1
            rounded-md
            text-[10px]
            font-medium
            text-brand-300
            transition-colors
            hover:text-brand-200
            sm:text-xs
          "
              >
                Back to top
                <ArrowUpRight aria-hidden="true" size={12} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
