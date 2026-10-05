import React, { useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MoveUpRight,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUser,
  logout,
} from "../../Store/Slice/authSlice";
import { logoutUser } from "../../Services/Auth/authApi";

const getRoleConfig = (role) => {
  switch (role) {
    case "student":
      return {
        label: "Student",
        dashboard: "/students/dashboard",
        dashboardLabel: "Dashboard",
        profile: "/students/profile",
      };

    case "tpo":
      return {
        label: "TPO",
        dashboard: "/depttpo/dashboard",
        dashboardLabel: "Dashboard",
        profile: "/tpo/profile",
      };

    case "spoc":
      return {
        label: "SPOC",
        dashboard: "/spoc/dashboard",
        dashboardLabel: "Dashboard",
        profile: "/spoc/profile",
      };

    case "admin":
      return {
        label: "Admin",
        dashboard: "/admin/dashboard",
        dashboardLabel: "Dashboard",
        profile: "/admin/profile",
      };

    default:
      return {
        label: "User",
        dashboard: "/",
        dashboardLabel: "Dashboard",
        profile: "/",
      };
  }
};

const Nav = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const normalizedRole = useMemo(() => {
    return user?.role?.trim().toLowerCase() || "";
  }, [user?.role]);

  const roleConfig = useMemo(
    () => getRoleConfig(normalizedRole),
    [normalizedRole],
  );

  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split("@")[0] ||
    roleConfig.label;

  const email = user?.email || "";

  const initials = useMemo(() => {
    const name = displayName.trim();

    if (!name) {
      return "U";
    }

    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }

    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }, [displayName]);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    setIsProfileOpen(false);

    try {
      await logoutUser();
    } catch {
    } finally {
      dispatch(logout());

      navigate("/auth/login", {
        replace: true,
      });

      setIsLoggingOut(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    [
      "focus-ring relative inline-flex items-center gap-2",
      "rounded-lg px-3 py-2",
      "text-sm font-medium",
      "transition-all duration-200",
      isActive
        ? "bg-cream-soft text-brand-700"
        : "text-ink-muted hover:bg-cream-soft hover:text-ink",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-cream/90 backdrop-blur-md">
      <nav
        aria-label="Main navigation"
        className="
          mx-auto flex min-h-16 w-full max-w-auto
          items-center justify-between
          gap-4
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
              className="block size-full object-contain"
            />
          </span>

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

        {!isAuthenticated ? (
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <NavLink
              to="/auth/login"
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

            <Link
              to="/students/applications/new"
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
              <MoveUpRight aria-hidden="true" size={14} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
            <div className="hidden items-center md:flex">
              <NavLink to={roleConfig.dashboard} className={navLinkClass}>
                <LayoutDashboard
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.8}
                />

                <span>{roleConfig.dashboardLabel}</span>
              </NavLink>
            </div>

            {normalizedRole === "student" && (
              <Link
                to="/students/applications/new"
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
                <span className="hidden xs:inline sm:inline">
                  Apply for NOC
                </span>

                <MoveUpRight aria-hidden="true" size={14} strokeWidth={2} />
              </Link>
            )}

            <div className="relative">
              <button
                type="button"
                aria-expanded={isProfileOpen}
                aria-haspopup="menu"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="
                  focus-ring
                  flex items-center gap-2
                  rounded-xl
                  border border-border
                  bg-cream-soft
                  px-2 py-1.5
                  transition-all duration-200
                  hover:border-brand-500
                  hover:shadow-sm
                  sm:gap-2.5
                  sm:px-2.5
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    flex size-8 shrink-0
                    items-center justify-center
                    rounded-lg
                    bg-brand-700
                    text-[11px]
                    font-bold
                    text-white
                    sm:size-9
                    sm:text-xs
                  "
                >
                  {initials}
                </span>

                <span className="hidden min-w-0 text-left sm:block">
                  <span
                    className="
                      block max-w-28 truncate
                      text-xs font-semibold
                      leading-tight text-ink
                      lg:max-w-36 lg:text-sm
                    "
                  >
                    {displayName}
                  </span>

                  <span
                    className="
                      mt-0.5 block
                      text-[10px] font-medium
                      leading-tight text-ink-muted
                    "
                  >
                    {roleConfig.label}
                  </span>
                </span>

                <ChevronDown
                  aria-hidden="true"
                  size={15}
                  strokeWidth={2}
                  className={[
                    "hidden shrink-0 text-ink-muted transition-transform duration-200 sm:block",
                    isProfileOpen ? "rotate-180" : "",
                  ].join(" ")}
                />
              </button>

              {isProfileOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setIsProfileOpen(false)}
                  />

                  <div
                    role="menu"
                    className="
                      absolute right-0 z-50 mt-2
                      w-64
                      overflow-hidden
                      rounded-xl
                      border border-border
                      bg-cream
                      shadow-lg
                    "
                  >
                    <div className="border-b border-border px-4 py-3">
                      <p
                        className="
                          truncate
                          text-sm font-semibold
                          text-ink
                        "
                      >
                        {displayName}
                      </p>

                      {email && (
                        <p
                          className="
                            mt-0.5 truncate
                            text-xs text-ink-muted
                          "
                        >
                          {email}
                        </p>
                      )}

                      <span
                        className="
                          mt-2 inline-flex
                          rounded-md
                          bg-cream-soft
                          px-2 py-1
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          text-brand-700
                        "
                      >
                        {roleConfig.label}
                      </span>
                    </div>

                    <div className="p-1.5">
                      <NavLink
                        to={roleConfig.dashboard}
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="
                          focus-ring
                          flex items-center gap-2.5
                          rounded-lg
                          px-3 py-2.5
                          text-sm font-medium
                          text-ink-muted
                          transition-colors duration-200
                          hover:bg-cream-soft
                          hover:text-ink
                        "
                      >
                        <LayoutDashboard
                          aria-hidden="true"
                          size={16}
                          strokeWidth={1.8}
                        />
                        Dashboard
                      </NavLink>

                      <NavLink
                        to={roleConfig.profile}
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="
                          focus-ring
                          flex items-center gap-2.5
                          rounded-lg
                          px-3 py-2.5
                          text-sm font-medium
                          text-ink-muted
                          transition-colors duration-200
                          hover:bg-cream-soft
                          hover:text-ink
                        "
                      >
                        <UserRound
                          aria-hidden="true"
                          size={16}
                          strokeWidth={1.8}
                        />
                        Profile
                      </NavLink>

                      <div className="my-1 border-t border-border" />

                      <button
                        type="button"
                        role="menuitem"
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="
                          focus-ring
                          flex w-full items-center gap-2.5
                          rounded-lg
                          px-3 py-2.5
                          text-left
                          text-sm font-medium
                          text-ink-muted
                          transition-colors duration-200
                          hover:bg-cream-soft
                          hover:text-ink
                          disabled:cursor-not-allowed
                          disabled:opacity-60
                        "
                      >
                        <LogOut
                          aria-hidden="true"
                          size={16}
                          strokeWidth={1.8}
                        />

                        {isLoggingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Nav;
