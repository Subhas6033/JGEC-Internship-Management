import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";

import { Nav, Footer } from "../Components";
import AdminSidebar from "../Components/Navigations/AdminSidebar";

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isAuthRoute = pathname.startsWith("/auth");
  const isStudentRoute = pathname.startsWith("/students");
  const isDeptTPORoutes = pathname.startsWith("/depttpo");
  const isTPORoutes = pathname.startsWith("/spoc");
  const isAdmin = pathname.startsWith("/admin");

  const isNotFoundRoute = pathname === "/404";

  // Routes without public navigation
  if (
    isAuthRoute ||
    isStudentRoute ||
    isDeptTPORoutes ||
    isTPORoutes ||
    isNotFoundRoute
  ) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  // Admin layout
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-cream text-ink">
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
          <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border bg-white/95 px-4 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-ink transition-colors hover:bg-cream-soft"
            >
              <Menu size={22} />
            </button>

            <span className="ml-3 font-display text-sm font-semibold text-ink">
              JGEC Admin Portal
            </span>
          </header>

          <main className="min-w-0 w-full">{children}</main>
        </div>
      </div>
    );
  }

  // Public application layout
  return (
    <div className="flex min-h-screen flex-col bg-cream text-ink">
      <Nav />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-auto px-5 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
