import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "motion/react";
import StudentNavbar from "../Components/Navigations/StudentNavbar";
import StudentSidebar from "../Components/Navigations/StudentSidebar";
import { pageFade } from "../Animations/animations";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Connect your authentication logout logic here.
    console.log("Student logout");
  };

  return (
    <div className="min-h-dvh overflow-x-clip bg-cream text-ink">
      <StudentNavbar
        onMenuClick={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        student={{
          name: "Aarav Sharma",
          role: "Student",
          initials: "AS",
        }}
      />

      <StudentSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className="
          min-h-dvh
          pt-16
          lg:pl-64
        "
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pageFade}
          className="
            min-h-[calc(100dvh-4rem)]
            w-full
          "
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default StudentLayout;
