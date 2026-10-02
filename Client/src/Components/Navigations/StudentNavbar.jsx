import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  CircleHelp,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "../index";
import {
  logout,
  selectAccessToken,
  selectUser,
} from "../../Store/Slice/authSlice";
import { logoutStudent } from "../../Services/Auth/studentAuth.api";

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "S";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const StudentNavbar = ({ onMenuClick, onLogout }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const student = useSelector(selectUser);
  const accessToken = useSelector(selectAccessToken);

  const studentName = student?.fullName || "Student";
  const studentRole = student?.role || "student";
  const studentInitials = getInitials(student?.fullName);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setProfileOpen(false);

    try {
      await logoutStudent(accessToken);
    } catch (error) {
      console.error("Student logout failed:", error);
    } finally {
      // Clear client-side authentication state even if
      // the backend request fails.
      dispatch(logout());

      if (onLogout) {
        onLogout();
      } else {
        navigate("/auth/login", { replace: true });
      }

      setIsLoggingOut(false);
    }
  };

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
              "
            >
              <img src="/jgecLogo.png" alt="jgec logo" />
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
              disabled={isLoggingOut}
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
                {studentInitials}
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
                  {studentName}
                </span>

                <span
                  className="
                    block text-[10px]
                    leading-tight
                    capitalize
                    text-ink-muted
                  "
                >
                  {studentRole}
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
                        {studentName}
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-ink-muted">
                        {studentRole}
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
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="
                          mt-1
                          w-full
                          justify-start
                        "
                      >
                        <LogOut size={15} strokeWidth={1.8} />

                        {isLoggingOut ? "Signing out..." : "Sign out"}
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
