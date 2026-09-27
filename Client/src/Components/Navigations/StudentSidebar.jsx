import { NavLink } from "react-router-dom";
import {
  Bell,
  FileText,
  Grid2X2,
  HelpCircle,
  Plus,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button, Card } from "../index";

const workspaceItems = [
  {
    label: "Dashboard",
    to: "/students/dashboard",
    icon: Grid2X2,
    end: true,
  },
  {
    label: "My Applications",
    to: "/students/applications",
    icon: FileText,
    end: true,
  },
  {
    label: "New Application",
    to: "/students/applications/new",
    icon: Plus,
    primary: true,
    end: true,
  },
  {
    label: "Documents",
    to: "/students/documents",
    icon: FileText,
    end: true,
  },
  {
    label: "Notifications",
    to: "/students/notifications",
    icon: Bell,
    end: true,
  },
];

const accountItems = [
  {
    label: "Profile",
    to: "/students/profile",
    icon: UserRound,
    end: true,
  },
  {
    label: "Settings",
    to: "/students/settings",
    icon: Settings,
    end: true,
  },
];

const SidebarItem = ({ item, onNavigate }) => {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        [
          "focus-ring group flex w-full items-center gap-3 rounded-lg",
          "px-3 py-2.5 text-sm font-medium",
          "transition-all duration-150",

          isActive
            ? [
                "bg-brand-700",
                "font-semibold",
                "text-white",
                "shadow-sm",
                "hover:bg-brand-800",
              ].join(" ")
            : item.primary
              ? [
                  "mb-1",
                  "border border-brand-700/15",
                  "bg-brand-700/8",
                  "text-brand-700",
                  "hover:border-brand-700/25",
                  "hover:bg-brand-700/12",
                ].join(" ")
              : [
                  "text-ink-muted",
                  "hover:bg-cream-dark",
                  "hover:text-ink",
                ].join(" "),
        ].join(" ")
      }
    >
      <Icon
        size={17}
        strokeWidth={1.9}
        className="shrink-0"
        aria-hidden="true"
      />

      <span className="truncate">{item.label}</span>
    </NavLink>
  );
};

const StudentSidebar = ({ open = false, onClose }) => {
  const sidebarContent = (
    <div className="flex h-full min-h-0 flex-col">
      {/* Mobile close */}
      <div className="flex items-center justify-end px-4 pt-4 lg:hidden">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close navigation"
          className="
            size-9
            p-0!
            text-ink-muted
            hover:bg-cream-dark
            hover:text-ink
          "
        >
          <X size={19} strokeWidth={1.8} />
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-4 lg:pt-6">
        <div>
          <p
            className="
              px-3 pb-2
              text-[10px] font-bold
              uppercase tracking-[0.16em]
              text-ink-muted
            "
          >
            Workspace
          </p>

          <nav aria-label="Student workspace" className="space-y-1">
            {workspaceItems.map((item) => (
              <SidebarItem key={item.to} item={item} onNavigate={onClose} />
            ))}
          </nav>
        </div>

        <div className="my-5 border-t border-border" />

        <div>
          <p
            className="
              px-3 pb-2
              text-[10px] font-bold
              uppercase tracking-[0.16em]
              text-ink-muted
            "
          >
            Account
          </p>

          <nav aria-label="Student account" className="space-y-1">
            {accountItems.map((item) => (
              <SidebarItem key={item.to} item={item} onNavigate={onClose} />
            ))}
          </nav>
        </div>
      </div>

      {/* Support */}
      <div className="border-t border-border p-3">
        <Card
          className="
            border-border
            bg-cream-soft
            p-4
            shadow-none
          "
        >
          <div
            className="
              mb-3 flex size-9
              items-center justify-center
              rounded-lg
              bg-cream-dark
              text-ink
            "
          >
            <HelpCircle size={18} strokeWidth={1.8} />
          </div>

          <p className="text-sm font-semibold text-ink">Need assistance?</p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Contact the placement cell for help with your application.
          </p>

          <NavLink
            to="/contact"
            onClick={onClose}
            className="
              focus-ring
              mt-3 inline-flex
              text-xs font-semibold
              text-brand-700
              transition-colors
              hover:text-brand-800
            "
          >
            Contact support
          </NavLink>
        </Card>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
          fixed inset-y-0 left-0 top-16
          z-40 hidden
          w-64
          border-r border-border
          bg-cream
          lg:block
        "
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="
                fixed inset-0 z-40
                bg-ink/20
                backdrop-blur-[2px]
                lg:hidden
              "
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="
                fixed inset-y-0 left-0 top-0
                z-50
                w-[min(18rem,85vw)]
                border-r border-border
                bg-cream
                shadow-card-hover
                lg:hidden
              "
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;
