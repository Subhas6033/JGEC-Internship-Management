import { NavLink, useNavigate } from "react-router-dom";
import { useAuthLogout } from "../../Services/Queries/adminAuth.queries";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  Users,
  FileCheck2,
  ChartNoAxesCombined,
  Settings,
  LogOut,
  X,
  BookOpen,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Card, Button } from "../index";

const navigationGroups = [
  {
    title: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "INTERNSHIP MANAGEMENT",
    items: [
      {
        label: "Organisations",
        path: "/admin/org",
        icon: Building2,
      },
      // {
      //   label: "Internship Drives",
      //   path: "/admin/internship-drives",
      //   icon: BriefcaseBusiness,
      // },
      {
        label: "NOC Management",
        path: "/admin/nocs",
        icon: FileCheck2,
      },
    ],
  },
  {
    title: "PEOPLE",
    items: [
      {
        label: "Students",
        path: "/admin/students",
        icon: GraduationCap,
      },
      {
        label: "Staff Management",
        path: "/admin/staff-management",
        icon: Users,
      },
      {
        label: "Departments",
        path: "/admin/departments",
        icon: BookOpen,
      },
    ],
  },
  {
    title: "INSIGHTS",
    items: [
      {
        label: "Analytics & Reports",
        path: "/admin/analytics",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

const AdminSidebar = ({
  isOpen = false,
  onClose,
  onLogout,
  collapsed = false,
  onToggleCollapse,
}) => {
  const navigate = useNavigate();

  const logoutMutation = useAuthLogout();

  const handleLogout = async () => {
    // Keep the optional override from the parent
    if (onLogout) {
      onLogout();
      return;
    }

    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      // Ignore: the hook's onSettled still clears local auth state
      console.error("Logout request failed:", error);
    } finally {
      navigate("/auth/admin/login", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col overflow-visible
          border-r border-border/80
          bg-white
          shadow-[4px_0_24px_rgba(0,0,0,0.025)]
          transition-all duration-300 ease-in-out
          ${collapsed ? "w-19" : "w-65"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand Header */}
        <div
          className={`
            flex h-17 shrink-0 items-center
            border-b border-border/70 hover:cursor-pointer
            ${collapsed ? "justify-center px-2" : "justify-between px-4"}
          `}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-xl"
              onClick={() => navigate("/")}
            >
              <img
                src="/jgecLogo.png"
                alt="JGEC Logo"
                className="h-9 w-9 object-contain"
              />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1 className="truncate font-display text-[15px] font-bold tracking-tight text-ink">
                  JGEC Portal
                </h1>

                <p className="mt-0.5 text-[10px] font-medium tracking-wide text-ink-muted">
                  ADMINISTRATION
                </p>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle (expanded state: inside header) */}
          {!collapsed && (
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Collapse sidebar"
              aria-label="Collapse sidebar"
              className="
                hidden size-8 shrink-0 items-center justify-center
                rounded-lg text-ink-muted transition-colors
                hover:bg-cream-soft hover:text-brand-700
                lg:flex hover:cursor-pointer
              "
            >
              <PanelLeftClose size={18} strokeWidth={1.9} />
            </button>
          )}

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              rounded-lg p-1.5
              text-ink-muted transition-colors
              hover:bg-cream-soft hover:text-ink
              lg:hidden
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Desktop Expand Toggle (collapsed state: just below header) */}
        {collapsed && (
          <div className="hidden shrink-0 justify-center border-b border-border/70 py-2 lg:flex">
            <button
              type="button"
              onClick={onToggleCollapse}
              title="Expand sidebar"
              aria-label="Expand sidebar"
              className="
                flex size-9 items-center justify-center
                rounded-lg text-ink-muted transition-colors
                hover:bg-brand-50 hover:text-brand-700
                hover:cursor-pointer
              "
            >
              <PanelLeftOpen size={18} strokeWidth={1.9} />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-3 py-5 scrollbar-thin">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="mb-2.5 px-3 text-[10px] font-bold tracking-[0.13em] text-ink-muted/80">
                  {group.title}
                </p>
              )}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === "/admin/dashboard"}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) => `
                        group relative flex min-h-10
                        items-center gap-3 rounded-lg
                        px-3 py-2 text-[13px] font-medium
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-brand-50 text-brand-700"
                            : "text-ink-muted hover:bg-cream-soft hover:text-ink"
                        }
                        ${collapsed ? "justify-center px-0" : ""}
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && !collapsed && (
                            <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-r-full bg-brand-700" />
                          )}

                          <Icon
                            size={18}
                            strokeWidth={isActive ? 2.2 : 1.8}
                            className={`
                              shrink-0 transition-colors
                              ${
                                isActive
                                  ? "text-brand-700"
                                  : "text-ink-muted group-hover:text-ink"
                              }
                            `}
                          />

                          {!collapsed && (
                            <span className="truncate">{item.label}</span>
                          )}

                          {!collapsed && isActive && (
                            <span className="ml-auto size-1.5 shrink-0 rounded-full bg-brand-700" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-border/70 bg-white px-3 py-2.5">
          {/* Administrator Profile */}
          {!collapsed && (
            <Card className="mb-2 rounded-lg border-brand-100 bg-cream-soft p-2 shadow-none">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  <ShieldCheck size={17} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-ink">
                    Administrator
                  </p>

                  <p className="text-[10px] text-ink-muted">System Admin</p>
                </div>

                <span className="size-2 rounded-full bg-green-500 ring-2 ring-green-100" />
              </div>
            </Card>
          )}

          {/* Logout */}
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`
              h-8 w-full justify-start rounded-lg
              px-3 text-xs font-semibold
              ${collapsed ? "justify-center px-0" : ""}
            `}
          >
            <LogOut size={16} />
            {!collapsed && "Logout"}
          </Button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
