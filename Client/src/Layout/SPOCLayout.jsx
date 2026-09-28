import { useState } from "react";
import { Outlet } from "react-router-dom";
import SPOCNavbar from "../Components/Navigations/SPOCNavbar";
import SPOCSidebar from "../Components/Navigations/SPOCSidebar";

const SPOCLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="flex min-h-screen">
        <SPOCSidebar open={sidebarOpen} onClose={closeSidebar} />

        <div className="flex min-w-0 flex-1 flex-col">
          <SPOCNavbar onMenuClick={() => setSidebarOpen(true)} />

          <main className="min-w-0 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default SPOCLayout;
