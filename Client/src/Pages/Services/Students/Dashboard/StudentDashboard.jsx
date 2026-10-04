import { motion } from "framer-motion";
import { ArrowRight, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardStats from "./DashboardStats";
import ApplicationProgress from "./ApplicationProgress";
import ProfileCompletion from "./ProfileCompletion";
import RecentApplications from "./RecentApplications";
import RequiredDocuments from "./RequiredDocuments";
import RecentNotifications from "./RecentNotifications";
import UpcomingDeadlines from "./UpcomingDeadlines";
import { useStudentDashboard } from "../../../../Services/Queries/studentDashboard.quires.js";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const StudentDashboard = () => {
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    refetch,
  } = useStudentDashboard();

  const dashboard = dashboardResponse?.data;

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
                <h1 className="font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
                  Welcome back
                  {dashboard?.student?.fullName
                    ? `, ${dashboard.student.fullName}.`
                    : "."}
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                  Manage your internship applications, documents, verification,
                  and important updates from one place.
                </p>
              </div>

              <Link
                to="/students/applications/new"
                className="focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-brand-800"
              >
                New Application
                <ArrowRight size={16} strokeWidth={1.9} />
              </Link>
            </div>
          </motion.div>

          {/* Loading state */}
          {isLoading && (
            <motion.div
              variants={cardAnimation}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-700 border-t-transparent" />

                <p className="text-sm font-medium text-ink-muted">
                  Loading your dashboard...
                </p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <motion.div
              variants={cardAnimation}
              initial="hidden"
              animate="visible"
              className="rounded-xl border border-red-200 bg-red-50 p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to load dashboard
                  </p>

                  <p className="mt-1 text-sm leading-6 text-red-700">
                    Something went wrong while fetching your dashboard
                    information.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => refetch()}
                  className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
                >
                  <RefreshCw size={16} strokeWidth={1.9} />
                  Try again
                </button>
              </div>
            </motion.div>
          )}

          {/* Dashboard content */}
          {!isLoading && !isError && dashboard && (
            <>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <DashboardStats stats={dashboard.stats} />
              </motion.div>

              <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                <ApplicationProgress
                  application={dashboard.currentApplication}
                />

                <ProfileCompletion
                  profileCompletion={dashboard.profileCompletion}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <RecentApplications
                  applications={dashboard.recentApplications || []}
                />

                <RequiredDocuments
                  documents={dashboard.requiredDocuments || []}
                />
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <RecentNotifications
                  notifications={dashboard.recentNotifications || []}
                />

                <UpcomingDeadlines
                  deadlines={dashboard.upcomingDeadlines || []}
                />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default StudentDashboard;
