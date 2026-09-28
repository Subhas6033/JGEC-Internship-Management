import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
  XCircle,
  Building2,
  Send,
  CalendarClock,
} from "lucide-react";
import { Button, Card } from "../index";

const navigationItems = [
  {
    label: "Dashboard",
    to: "/depttpo/dashboard",
    icon: LayoutDashboard,
  },

  {
    label: "Applications",
    to: "/depttpo/applications",
    icon: FileText,

    children: [
      {
        label: "All Companies",
        to: "/depttpo/applications",
        icon: Building2,
      },

      {
        label: "Pending Review",
        to: "/depttpo/applications/pending",
        icon: Clock3,
      },

      {
        label: "Accepted",
        to: "/depttpo/applications/accepted",
        icon: CheckCircle2,
      },

      {
        label: "Rejected",
        to: "/depttpo/applications/rejected",
        icon: XCircle,
      },

      {
        label: "Sent to TPO",
        to: "/depttpo/applications/sent",
        icon: Send,
      },
    ],
  },

  {
    label: "Deadlines",
    to: "/depttpo/deadlines",
    icon: CalendarClock,
  },

  {
    label: "Notifications",
    to: "/depttpo/notifications",
    icon: Bell,
  },
];

const accountItems = [
  {
    label: "Profile",
    to: "/depttpo/profile",
    icon: UserRound,
  },
  {
    label: "Settings",
    to: "/depttpo/settings",
    icon: Settings,
  },
];

const baseNavClasses = `
  focus-ring
  flex items-center gap-2
  rounded-lg px-3 py-2
  text-sm font-medium
  transition-colors duration-150
`;

const NavItem = ({ item, onClick }) => {
  const Icon = item.icon;
  const hasChildren = item.children?.length > 0;

  if (!hasChildren) {
    return (
      <NavLink
        to={item.to}
        end
        onClick={onClick}
        className={({ isActive }) =>
          [
            baseNavClasses,
            isActive
              ? "bg-brand-700 text-white shadow-sm"
              : "text-ink-muted hover:bg-cream-dark hover:text-ink",
          ].join(" ")
        }
      >
        <Icon size={16} strokeWidth={1.8} />

        <span>{item.label}</span>
      </NavLink>
    );
  }

  return (
    <div className="group relative">
      <NavLink
        to={item.to}
        end
        className={({ isActive }) =>
          [
            baseNavClasses,
            isActive
              ? "bg-brand-700 text-white shadow-sm"
              : "text-ink-muted hover:bg-cream-dark hover:text-ink",
          ].join(" ")
        }
      >
        <Icon size={16} strokeWidth={1.8} />

        <span>{item.label}</span>

        <ChevronDown
          size={14}
          strokeWidth={1.8}
          className="
            ml-0.5
            transition-transform
            duration-150
            group-hover:rotate-180
          "
        />
      </NavLink>

      {/* Applications submenu */}
      <div
        className="
          invisible
          absolute
          left-0
          top-full
          z-50
          mt-1.5
          w-56
          translate-y-1
          rounded-xl
          border
          border-border
          bg-cream-soft
          p-1.5
          opacity-0
          shadow-card
          transition-all
          duration-150
          group-hover:visible
          group-hover:translate-y-0
          group-hover:opacity-100
        "
      >
        <div className="px-2.5 pb-1.5 pt-1">
          <p
            className="
              text-[10px]
              font-bold
              uppercase
              tracking-[0.14em]
              text-ink-muted
            "
          >
            Applications
          </p>
        </div>

        {item.children.map((child) => {
          const ChildIcon = child.icon;

          return (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onClick}
              className={({ isActive }) =>
                [
                  "focus-ring",
                  "flex items-center gap-2.5",
                  "rounded-lg px-3 py-2.5",
                  "text-sm font-medium",
                  "transition-colors",
                  isActive
                    ? "bg-brand-700 text-white"
                    : "text-ink-muted hover:bg-cream-dark hover:text-ink",
                ].join(" ")
              }
            >
              <ChildIcon size={15} strokeWidth={1.8} />

              <span>{child.label}</span>

              <ChevronRight
                size={13}
                strokeWidth={1.8}
                className="ml-auto opacity-50"
              />
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

const DeptTPONavbar = ({
  onMenuClick,
  open = false,
  onClose,
  coordinator = {
    name: "TPO Coordinator",
    department: "",
    initials: "TP",
  },
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [applicationsOpen, setApplicationsOpen] = useState(false);

  const closeProfile = () => {
    setProfileOpen(false);
  };

  const closeMobileNavigation = () => {
    setApplicationsOpen(false);
    onClose?.();
  };

  return (
    <>
      {/* Desktop / Top Navbar */}
      <header
        className="
          fixed inset-x-0 top-0 z-50
          h-16
          border-b border-border
          bg-cream-soft/95
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto flex h-full
            max-w-[1600px]
            items-center
            justify-between
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {/* Mobile menu button */}
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

            {/* Brand */}
            <Link
              to="/depttpo/dashboard"
              className="
                focus-ring
                flex min-w-0
                items-center gap-2.5
                rounded-lg
              "
            >
              <span
                className="
                  flex size-9
                  shrink-0
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-lg
                "
              >
                <img
                  src="/jgecLogo.png"
                  alt="JGEC"
                  className="size-full object-contain"
                />
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
                  Department TPO Portal
                </span>
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav
            aria-label="Department TPO navigation"
            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
          >
            {navigationItems.map((item) => (
              <NavItem key={item.to} item={item} />
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Help */}
            <Link
              to="/contact"
              className="
                focus-ring
                hidden
                items-center gap-1.5
                rounded-lg
                px-2.5 py-2
                text-xs font-medium
                text-ink-muted
                transition-colors
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
                  {coordinator.initials}
                </span>

                <span className="hidden min-w-0 text-left sm:block">
                  <span
                    className="
                      block max-w-40 truncate
                      text-xs font-semibold
                      leading-tight
                      text-ink
                    "
                  >
                    {coordinator.name}
                  </span>

                  <span
                    className="
                      block max-w-40 truncate
                      text-[10px]
                      leading-tight
                      text-ink-muted
                    "
                  >
                    {coordinator.department}
                  </span>
                </span>

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className="
                    hidden
                    shrink-0
                    text-ink-muted
                    sm:block
                  "
                />
              </Button>

              {/* Profile dropdown */}
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
                    transition={{
                      duration: 0.15,
                    }}
                    className="
                      absolute
                      right-0
                      top-full
                      mt-2
                      w-64
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
                      {/* User information */}
                      <div
                        className="
                          border-b
                          border-border
                          px-4
                          py-3
                        "
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="
                              flex size-9
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-cream-dark
                              text-xs
                              font-semibold
                              text-ink
                            "
                          >
                            {coordinator.initials}
                          </span>

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-sm
                                font-semibold
                                text-ink
                              "
                            >
                              {coordinator.name}
                            </p>

                            <p
                              className="
                                mt-0.5
                                truncate
                                text-xs
                                text-ink-muted
                              "
                            >
                              {coordinator.department}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Account links */}
                      <div className="p-1.5">
                        {accountItems.map((item) => {
                          const Icon = item.icon;

                          return (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={closeProfile}
                              className="
                                focus-ring
                                flex
                                items-center
                                gap-2.5
                                rounded-md
                                px-3 py-2
                                text-sm
                                text-ink-muted
                                transition-colors
                                hover:bg-cream
                                hover:text-ink
                              "
                            >
                              <Icon size={15} strokeWidth={1.8} />

                              {item.label}
                            </Link>
                          );
                        })}

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

      {/* Mobile navigation */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileNavigation}
              className="
                fixed inset-0
                z-40
                bg-ink/20
                backdrop-blur-[2px]
                lg:hidden
              "
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="
                fixed
                inset-y-0
                left-0
                top-0
                z-50
                flex
                w-[min(18rem,85vw)]
                flex-col
                border-r
                border-border
                bg-cream
                shadow-card-hover
                lg:hidden
              "
            >
              {/* Drawer header */}
              <div
                className="
                  flex
                  h-16
                  items-center
                  justify-between
                  border-b
                  border-border
                  px-4
                "
              >
                <Link
                  to="/depttpo/dashboard"
                  onClick={closeMobileNavigation}
                  className="
                    focus-ring
                    flex
                    items-center
                    gap-2.5
                  "
                >
                  <span
                    className="
                      flex size-9
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-lg
                    "
                  >
                    <img
                      src="/jgecLogo.png"
                      alt="JGEC"
                      className="size-full object-contain"
                    />
                  </span>

                  <span>
                    <span
                      className="
                        block
                        text-sm
                        font-semibold
                        text-ink
                      "
                    >
                      Internship NOC
                    </span>

                    <span
                      className="
                        block
                        text-[10px]
                        text-ink-muted
                      "
                    >
                      Department TPO
                    </span>
                  </span>
                </Link>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeMobileNavigation}
                  aria-label="Close navigation"
                  className="
                    size-9
                    p-0!
                    text-ink-muted
                    hover:bg-cream-dark
                  "
                >
                  <X size={19} strokeWidth={1.8} />
                </Button>
              </div>

              {/* Mobile links */}
              <div className="flex-1 overflow-y-auto p-3">
                <p
                  className="
                    px-3
                    pb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-ink-muted
                  "
                >
                  Workspace
                </p>

                <nav
                  aria-label="Mobile department navigation"
                  className="space-y-1"
                >
                  {navigationItems.map((item) => {
                    if (!item.children) {
                      return (
                        <NavItem
                          key={item.to}
                          item={item}
                          onClick={closeMobileNavigation}
                        />
                      );
                    }

                    const Icon = item.icon;

                    return (
                      <div key={item.to}>
                        {/* Applications button */}
                        <button
                          type="button"
                          onClick={() =>
                            setApplicationsOpen((current) => !current)
                          }
                          aria-expanded={applicationsOpen}
                          className="
                            focus-ring
                            flex w-full
                            items-center gap-2
                            rounded-lg
                            px-3 py-2
                            text-sm font-medium
                            text-ink-muted
                            transition-colors
                            hover:bg-cream-dark
                            hover:text-ink
                          "
                        >
                          <Icon size={16} strokeWidth={1.8} />

                          <span>{item.label}</span>

                          <ChevronDown
                            size={14}
                            strokeWidth={1.8}
                            className={`
                              ml-auto
                              transition-transform
                              duration-150
                              ${applicationsOpen ? "rotate-180" : ""}
                            `}
                          />
                        </button>

                        {/* Mobile Applications submenu */}
                        <AnimatePresence initial={false}>
                          {applicationsOpen && (
                            <motion.div
                              initial={{
                                height: 0,
                                opacity: 0,
                              }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                              }}
                              exit={{
                                height: 0,
                                opacity: 0,
                              }}
                              transition={{
                                duration: 0.18,
                              }}
                              className="overflow-hidden"
                            >
                              <div
                                className="
                                  ml-4
                                  mt-1
                                  space-y-1
                                  border-l
                                  border-border
                                  pl-2
                                "
                              >
                                {item.children.map((child) => {
                                  const ChildIcon = child.icon;

                                  return (
                                    <NavLink
                                      key={child.to}
                                      to={child.to}
                                      onClick={closeMobileNavigation}
                                      className={({ isActive }) =>
                                        [
                                          "focus-ring",
                                          "flex items-center gap-2",
                                          "rounded-lg px-3 py-2",
                                          "text-sm",
                                          "transition-colors",
                                          isActive
                                            ? "bg-brand-700 text-white"
                                            : "text-ink-muted hover:bg-cream-dark hover:text-ink",
                                        ].join(" ")
                                      }
                                    >
                                      <ChildIcon size={14} strokeWidth={1.8} />

                                      <span>{child.label}</span>
                                    </NavLink>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </nav>

                <div className="my-5 border-t border-border" />

                <p
                  className="
                    px-3
                    pb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-ink-muted
                  "
                >
                  Account
                </p>

                <nav className="space-y-1">
                  {accountItems.map((item) => (
                    <NavItem
                      key={item.to}
                      item={item}
                      onClick={closeMobileNavigation}
                    />
                  ))}
                </nav>
              </div>

              {/* Coordinator information */}
              <div className="border-t border-border p-3">
                <Card
                  className="
                    border-border
                    bg-cream-soft
                    p-3
                    shadow-none
                  "
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="
                        flex size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-cream-dark
                        text-xs
                        font-semibold
                        text-ink
                      "
                    >
                      {coordinator.initials}
                    </span>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {coordinator.name}
                      </p>

                      <p className="truncate text-xs text-ink-muted">
                        {coordinator.department}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DeptTPONavbar;
