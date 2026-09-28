import { useState } from "react";
import { Outlet } from "react-router-dom";
import DeptTPONavbar from "../Components/Navigations/DeptTPONavbar";

const DeptTPOLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream">
      <DeptTPONavbar
        open={menuOpen}
        onMenuClick={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        coordinator={{
          name: "TPO Coordinator",
          department: "Information Technology",
          initials: "TP",
        }}
        onLogout={() => {
          // Connect existing logout handler here.
        }}
      />

      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default DeptTPOLayout;
