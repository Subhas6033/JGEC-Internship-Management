import { useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../Components/Navigations/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <div
        className={`
          min-h-screen min-w-0 transition-all duration-300
          ${collapsed ? "lg:pl-19" : "lg:pl-67.5"}
        `}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-ink hover:bg-cream-soft"
          >
            <Menu size={22} />
          </button>

          <span className="ml-3 font-display font-semibold text-ink">
            JGEC Admin Portal
          </span>
        </header>

        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
