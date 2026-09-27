import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  CircleHelp,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Card } from "../index";

const StudentNavbar = ({
  onMenuClick,
  student = {
    name: "Ayan Sharma",
    role: "Student",
    initials: "AS",
  },
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        h-16
        border-b border-border
        bg-cream-soft/95
        backdrop-blur-md
      "
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile menu */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            aria-label="Open navigation"
            className="
              size-9
              shrink-0
              p-0!
              text-ink-muted
              hover:bg-cream-dark
              hover:text-ink
              lg:hidden
            "
          >
            <Menu size={20} strokeWidth={1.8} />
          </Button>

          <Link
            to="/students/dashboard"
            className="
              focus-ring
              flex min-w-0 items-center gap-2.5
              rounded-lg
            "
          >
            <span
              className="
                flex size-9 shrink-0
                items-center justify-center
                overflow-hidden
                rounded-lg
                bg-brand-700
                text-white
                shadow-sm
              "
            >
              <span className="text-sm font-semibold">J</span>
            </span>

            <span className="flex min-w-0 flex-col">
              <span
                className="
                  truncate
                  text-sm font-semibold
                  leading-tight
                  text-ink
                "
              >
                Internship NOC
              </span>

              <span
                className="
                  hidden
                  text-[10px] font-medium
                  leading-tight
                  text-ink-muted
                  sm:block
                "
              >
                Student Portal
              </span>
            </span>
          </Link>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Help */}
          <Link
            to="/contact"
            className="
              focus-ring
              hidden items-center gap-1.5
              rounded-lg
              px-2.5 py-2
              text-xs font-medium
              text-ink-muted
              transition-colors duration-150
              hover:bg-cream-dark
              hover:text-ink
              sm:flex
            "
          >
            <CircleHelp size={15} strokeWidth={1.8} />

            <span>Help & Support</span>
          </Link>

          <div className="hidden h-7 w-px bg-border sm:block" />

          {/* Profile */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setProfileOpen((current) => !current)}
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="
                h-auto!
                px-1.5!
                py-1.5!
                text-ink
                hover:bg-cream-dark
              "
            >
              <span
                className="
                  flex size-8 shrink-0
                  items-center justify-center
                  rounded-full
                  bg-cream-dark
                  text-[11px] font-semibold
                  text-ink
                "
              >
                {student.initials}
              </span>

              <span className="hidden min-w-0 text-left sm:block">
                <span
                  className="
                    block max-w-32 truncate
                    text-xs font-semibold
                    leading-tight
                    text-ink
                  "
                >
                  {student.name}
                </span>

                <span
                  className="
                    block text-[10px]
                    leading-tight
                    text-ink-muted
                  "
                >
                  {student.role}
                </span>
              </span>

              <ChevronDown
                size={15}
                strokeWidth={1.7}
                className="
                  hidden shrink-0
                  text-ink-muted
                  sm:block
                "
              />
            </Button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -5,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -4,
                    scale: 0.98,
                  }}
                  transition={{ duration: 0.15 }}
                  className="
                    absolute right-0 top-full mt-2
                    w-56
                  "
                >
                  <Card
                    className="
                      overflow-hidden
                      border-border
                      bg-cream-soft
                      shadow-card
                    "
                  >
                    {/* Profile information */}
                    <div className="border-b border-border px-4 py-3">
                      <p className="truncate text-sm font-semibold text-ink">
                        {student.name}
                      </p>

                      <p className="mt-0.5 text-xs text-ink-muted">
                        {student.role}
                      </p>
                    </div>

                    {/* Menu */}
                    <div className="p-1.5">
                      <Link
                        to="/students/profile"
                        onClick={() => setProfileOpen(false)}
                        className="
                          focus-ring
                          flex items-center gap-2.5
                          rounded-md
                          px-3 py-2
                          text-sm text-ink-muted
                          transition-colors
                          hover:bg-cream
                          hover:text-ink
                        "
                      >
                        <UserRound size={15} strokeWidth={1.8} />
                        Profile
                      </Link>

                      <Link
                        to="/students/settings"
                        onClick={() => setProfileOpen(false)}
                        className="
                          focus-ring
                          flex items-center gap-2.5
                          rounded-md
                          px-3 py-2
                          text-sm text-ink-muted
                          transition-colors
                          hover:bg-cream
                          hover:text-ink
                        "
                      >
                        <Settings size={15} strokeWidth={1.8} />
                        Settings
                      </Link>

                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={onLogout}
                        className="
                          mt-1
                          w-full
                          justify-start
                        "
                      >
                        <LogOut size={15} strokeWidth={1.8} />
                        Sign out
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
