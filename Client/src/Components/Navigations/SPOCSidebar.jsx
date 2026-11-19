import {
  BriefcaseBusiness,
  ClipboardCheck,
  FileCheck2,
  LayoutDashboard,
  UserRound,
  X,
} from "lucide-react";
import { NavLink, Link } from "react-router-dom";

const navigation = [
  {
    label: "Dashboard",
    to: "/spoc/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Applications",
    to: "/spoc/applications",
    icon: ClipboardCheck,
  },
  {
    label: "NOCs",
    to: "/spoc/nocs",
    icon: FileCheck2,
  },
  {
    label: "Profile",
    to: "/spoc/profile",
    icon: UserRound,
  },
];

const SPOCSidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
        />
      )}

      {/* Fixed Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50",
          "flex h-dvh w-65 flex-col",
          "overflow-hidden",
          "border-r border-border",
          "bg-cream-soft",
          "transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="shrink-0 border-b border-border">
          <div className="flex min-h-16 items-center justify-between px-4 sm:px-5">
            <Link
              to="/"
              onClick={onClose}
              aria-label="Internship NOC - JGEC SPOC"
              className="focus-ring group flex min-w-0 items-center gap-2.5 rounded-lg"
            >
              <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-cream-soft p-1 transition-all duration-200 group-hover:border-brand-500 group-hover:shadow-sm sm:size-10 sm:p-1.5">
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
                <span className="truncate text-[13px] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-sm">
                  Internship NOC
                </span>

                <span className="mt-0.5 truncate text-[9px] font-medium uppercase leading-tight tracking-[0.04em] text-ink-muted">
                  JGEC · SPOC Portal
                </span>
              </span>
            </Link>

            {/* Mobile close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="focus-ring rounded-lg p-2 text-ink-muted transition-colors duration-200 hover:bg-cream-dark hover:text-ink lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav
          aria-label="SPOC navigation"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5"
        >
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "focus-ring group",
                      "flex min-h-10 items-center gap-3",
                      "rounded-lg px-3 py-2.5",
                      "text-sm font-medium",
                      "transition-all duration-200",
                      isActive
                        ? "bg-brand-100 text-brand-700 shadow-sm"
                        : "text-ink-muted hover:bg-cream-dark hover:text-ink",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        strokeWidth={isActive ? 2.2 : 2}
                        className="shrink-0"
                      />

                      <span className="truncate">{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* SPOC Information */}
        <div className="shrink-0 border-t border-border p-3">
          <div className="rounded-xl bg-brand-900 p-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-800">
              <BriefcaseBusiness size={18} className="text-brand-200" />
            </div>

            <p className="mt-3 text-sm font-semibold text-cream-soft">
              SPOC Workflow
            </p>

            <p className="mt-1 text-xs leading-5 text-brand-200">
              Review Organisation-wise applications after the department
              deadline and generate NOCs after approval.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SPOCSidebar;
