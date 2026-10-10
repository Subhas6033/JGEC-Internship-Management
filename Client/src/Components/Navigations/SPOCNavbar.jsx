import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../index";
import { selectUser, selectIsAuthenticated } from "../../Store/Slice/authSlice";
import {
  useCurrentSpoc,
  useSpocLogout,
} from "../../Services/Queries/spocAuth.queries";

const SPOCNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: currentSpoc } = useCurrentSpoc(isAuthenticated);
  const logoutMutation = useSpocLogout();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  // Current authenticated SPOC
  const profileUser =
    currentSpoc?.user || currentSpoc?.spoc || currentSpoc || user;
  const fullName =
    profileUser?.fullName ||
    profileUser?.name ||
    "SPOC Training and Internship";
  const email = profileUser?.email || "";
  const role = profileUser?.role || "SPOC";
  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Close dropdown with escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);
  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } finally {
      setIsProfileOpen(false);
      navigate("/auth/login", {
        replace: true,
      });
    }
  };

  // Toggle profile
  const handleProfileClick = () => {
    setIsProfileOpen((previous) => !previous);
  };

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
          mx-auto flex min-h-16 w-full
          items-center justify-between
          px-4 sm:px-6 lg:px-8
        "
      >
        {/* Left side */}
        <div className="flex min-w-0 items-center">
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
              rounded-lg
              text-ink-muted
              hover:bg-cream-dark
              hover:text-ink
              lg:hidden
            "
          >
            <Menu size={20} strokeWidth={2} />
          </Button>
        </div>
        {/* Right Side */}
        <div
          className="
            flex shrink-0
            items-center
            gap-2
            sm:gap-3
          "
        >
          {/* Notifications */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-label="Notifications — 2 unread"
            className="
              relative
              size-9
              shrink-0
              rounded-lg
              p-0!
              text-ink-muted
              hover:bg-cream-dark/90
              hover:text-ink
              active:scale-95
              focus-visible:ring-brand-500/30
            "
          >
            <Bell size={25} strokeWidth={2} />

            {/* Notification badge */}
            <span
              aria-hidden="true"
              className="
                absolute
                right-0.5
                top-0.5
                flex
                size-4
                items-center
                justify-center
                rounded-full
                border-2
                border-cream
                bg-danger
                text-[9px]
                font-bold
                leading-none
                text-white
                shadow-sm
              "
            >
              2
            </span>
          </Button>

          {/* Profile Sections */}
          <div
            ref={profileRef}
            className="
              relative
              ml-1
              border-l
              border-border
              pl-2
              sm:pl-3
            "
          >
            <Button
              variant="ghost"
              type="button"
              onClick={handleProfileClick}
              aria-label="Open SPOC account menu"
              aria-expanded={isProfileOpen}
              className="
                group
                flex
                items-center
                gap-2
                rounded-lg
                p-1.5
                text-ink
                hover:bg-cream-dark
              "
            >
              {/* User information */}
              <span
                className="
                  hidden
                  min-w-0
                  text-right
                  sm:block
                "
              >
                <span
                  className="
                    block
                    max-w-55
                    truncate
                    text-sm
                    font-semibold
                    leading-tight
                    text-ink
                  "
                >
                  {fullName}
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    max-w-55
                    truncate
                    text-[11px]
                    leading-tight
                    text-ink-muted
                  "
                >
                  {email || "Training & Placement Co-ordinator, JGEC"}
                </span>
              </span>

              {/* Avatar */}
              <span
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-brand-100
                  text-brand-700
                  ring-1
                  ring-brand-200/60
                  transition-all
                  duration-200
                  group-hover:bg-brand-200
                  group-hover:ring-brand-300
                "
              >
                <UserRound size={17} strokeWidth={2} />
              </span>

              {/* Chevron */}
              <ChevronDown
                size={15}
                strokeWidth={2}
                className={`
                  hidden
                  text-ink-muted
                  transition-transform
                  duration-200
                  sm:block
                  ${
                    isProfileOpen
                      ? "rotate-180 text-ink"
                      : "group-hover:text-ink"
                  }
                `}
              />
            </Button>
            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-full
                  z-50
                  mt-2
                  w-70
                  overflow-hidden
                  rounded-xl
                  border
                  border-border
                  bg-cream-soft
                  shadow-[0_12px_32px_rgba(0,0,0,0.10)]
                  ring-1
                  ring-black/5
                "
              >
                {/* Profile information */}
                <div
                  className="
                    border-b
                    border-border
                    bg-cream
                    px-4
                    py-4
                  "
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div
                      className="
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-brand-100
                        text-brand-700
                        ring-1
                        ring-brand-200
                      "
                    >
                      <UserRound size={19} strokeWidth={2} />
                    </div>

                    {/* User details */}
                    <div className="min-w-0">
                      <p
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-ink
                        "
                      >
                        {fullName}
                      </p>

                      <p
                        className="
                          mt-0.5
                          truncate
                          text-xs
                          text-ink-muted
                        "
                      >
                        {email || "SPOC"}
                      </p>

                      <span
                        className="
                          mt-1.5
                          inline-flex
                          rounded-full
                          bg-brand-100
                          px-2
                          py-0.5
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-brand-700
                        "
                      >
                        {role}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation items */}
                <div className="p-1.5">
                  <Link
                    to="/spoc/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-ink
                      transition-colors
                      duration-150
                      hover:bg-cream-dark
                    "
                  >
                    <span
                      className="
                        flex
                        size-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-cream-dark
                        text-ink-muted
                      "
                    >
                      <UserRound size={16} />
                    </span>

                    <span className="font-medium">My Profile</span>
                  </Link>

                  <Link
                    to="/spoc/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-lg
                      px-3
                      py-2.5
                      text-sm
                      text-ink
                      transition-colors
                      duration-150
                      hover:bg-cream-dark
                    "
                  >
                    <span
                      className="
                        flex
                        size-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-cream-dark
                        text-ink-muted
                      "
                    >
                      <Settings size={16} />
                    </span>

                    <span className="font-medium">Settings</span>
                  </Link>
                </div>

                {/* Logout */}
                <div
                  className="
                    border-t
                    border-border
                    p-1.5
                  "
                >
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                    className="
    flex
    w-full
    items-center
    justify-start
    gap-3
    rounded-lg
    px-3
    py-2.5
    text-sm
    font-medium
    text-red-600
    hover:bg-red-50
    hover:text-white/95
    focus-visible:ring-red-500/30
    disabled:cursor-not-allowed
    disabled:opacity-60
  "
                  >
                    <span
                      className="
      flex
      size-8
      shrink-0
      items-center
      justify-center
      rounded-lg
      bg-red-50
      text-red-600
      transition-colors
      group-hover:bg-red-100
    "
                    >
                      <LogOut size={16} strokeWidth={2} />
                    </span>

                    <span>
                      {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                    </span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default SPOCNavbar;
