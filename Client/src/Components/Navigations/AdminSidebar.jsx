import {
  Bell,
  Building2,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Students",
    path: "/admin/students",
    icon: GraduationCap,
  },
  {
    label: "Companies",
    path: "/admin/companies",
    icon: Building2,
  },
  {
    label: "Applications",
    path: "/admin/applications",
    icon: ClipboardCheck,
  },
  {
    label: "Department TPOs",
    path: "/admin/department-tpos",
    icon: Users,
  },
];

const systemItems = [
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/admin/dashboard") {
      return location.pathname === path;
    }

    return location.pathname.startsWith(path);
  };

  const renderItems = (items) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isActive(item.path);

      return (
        <Link
          key={item.path}
          to={item.path}
          onClick={onClose}
          className={[
            "flex items-center gap-3 rounded-lg px-3 py-2.5",
            "text-sm font-medium transition-colors",
            active
              ? "bg-brand-50 text-brand-700"
              : "text-ink-muted hover:bg-cream hover:text-ink",
          ].join(" ")}
        >
          <Icon size={18} strokeWidth={1.8} />

          <span>{item.label}</span>

          {active && (
            <span className="ml-auto size-1.5 rounded-full bg-brand-700" />
          )}
        </Link>
      );
    });

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col",
          "border-r border-border bg-white",
          "transition-transform duration-200",
          "lg:static lg:z-auto lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link
            to="/admin/dashboard"
            onClick={onClose}
            className="flex items-center gap-2.5"
          >
            <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border bg-cream-soft p-1">
              <img
                src="/jgecLogo.png"
                alt="JGEC"
                className="size-full object-contain"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-ink">Internship NOC</p>

              <p className="text-[9px] font-medium uppercase tracking-wider text-ink-muted">
                JGEC Management
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-ink-muted hover:bg-cream hover:text-ink lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
            Administration
          </p>

          <nav className="mt-3 space-y-1">{renderItems(navigationItems)}</nav>

          <p className="mt-7 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
            System
          </p>

          <nav className="mt-3 space-y-1">{renderItems(systemItems)}</nav>
        </div>

        {/* Admin */}
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-cream-soft p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
              AD
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                Portal Admin
              </p>

              <p className="truncate text-xs text-ink-muted">
                System Administrator
              </p>
            </div>

            <button
              type="button"
              aria-label="Log out"
              className="rounded-lg p-1.5 text-ink-muted hover:bg-white hover:text-danger"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
