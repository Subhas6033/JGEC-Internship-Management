import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStats from "./DashboardStats";
import ApplicationProgress from "./ApplicationProgress";
import ProfileCompletion from "./ProfileCompletion";
import RecentApplications from "./RecentApplications";
import RequiredDocuments from "./RequiredDocuments";
import RecentNotifications from "./RecentNotifications";
import UpcomingDeadlines from "./UpcomingDeadlines";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const StudentDashboard = () => {
  return (
    <>
      <title>Student Dashboard | JGEC Internship Portal</title>
      <meta
        name="description"
        content="Manage your internship applications, documents, verification status, notifications, and upcoming deadlines from your JGEC student dashboard."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#ffffff" />
      <meta
        property="og:title"
        content="Student Dashboard | JGEC Internship Portal"
      />
      <meta
        property="og:description"
        content="Manage your internship applications, documents, verification status, and important updates."
      />
      <meta property="og:type" content="website" />

      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
          >
            <p className="eyebrow">Student workspace</p>

            <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1
                  className="
                    font-display
                    text-3xl
                    leading-tight
                    tracking-tight
                    text-ink
                    sm:text-4xl
                  "
                >
                  Welcome back, Indrani.
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                  Manage your internship applications, documents, verification,
                  and important updates from one place.
                </p>
              </div>

              <Link
                to="/student/applications/new"
                className="
                  focus-ring
                  inline-flex
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-brand-700
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  duration-150
                  hover:bg-brand-800
                "
              >
                New Application
                <ArrowRight size={16} strokeWidth={1.9} />
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <DashboardStats />
          </motion.div>

          {/* Current status */}
          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <ApplicationProgress />
            <ProfileCompletion />
          </div>

          {/* Applications + Documents */}
          <div className="grid gap-4 lg:grid-cols-2">
            <RecentApplications />
            <RequiredDocuments />
          </div>

          {/* Notifications + Deadlines */}
          <div className="grid gap-4 lg:grid-cols-2">
            <RecentNotifications />
            <UpcomingDeadlines />
          </div>
        </div>
      </section>
    </>
  );
};

export default StudentDashboard;
