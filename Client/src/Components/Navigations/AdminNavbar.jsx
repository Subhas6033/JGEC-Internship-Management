import { Bell, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/students": "Students",
  "/admin/companies": "Companies",
  "/admin/applications": "Applications",
  "/admin/department-tpos": "Department TPOs",
  "/admin/notifications": "Notifications",
  "/admin/settings": "Settings",
};

const AdminNavbar = ({ onMenuOpen }) => {
  const location = useLocation();

  const getPageTitle = () => {
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }

    const matchingPath = Object.keys(pageTitles).find((path) =>
      location.pathname.startsWith(path),
    );

    return matchingPath ? pageTitles[matchingPath] : "Administration";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-cream/90 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuOpen}
            aria-label="Open navigation"
            className="rounded-lg p-2 text-ink-muted hover:bg-cream-dark hover:text-ink lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div>
            <p className="eyebrow">Administration</p>

            <h1 className="text-lg font-semibold tracking-tight text-ink">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg border border-border bg-white p-2.5 text-ink-muted hover:text-ink"
          >
            <Bell size={18} />

            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
          </button>

          <div className="hidden h-8 w-px bg-border sm:block" />

          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold text-ink">Portal Admin</p>

            <p className="text-[11px] text-ink-muted">System Administrator</p>
          </div>

          <div className="flex size-9 items-center justify-center rounded-full bg-brand-700 text-xs font-semibold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
