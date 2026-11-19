import { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import SPOCNavbar from "../Components/Navigations/SPOCNavbar";
import SPOCSidebar from "../Components/Navigations/SPOCSidebar";

const SPOCLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-cream text-ink">
      {/* Sidebar remains fixed on desktop */}
      <SPOCSidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main content reserves the sidebar's width */}
      <div className="min-w-0 lg:pl-65">
        <SPOCNavbar onMenuClick={openSidebar} />

        <main className="min-h-[calc(100vh-4rem)] min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SPOCLayout;
