import { Bell } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../../../Components";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";
import { useDeptTpoDashboard } from "../../../../Hooks/Dashboard/useDeptTpoDashboard";
import DashboardStats from "./DashboardStats";
import ApplicationStatusChart from "./ApplicationStatusChart";
import ApplicationTrendChart from "./ApplicationTrendChart";
import PendingApplications from "./PendingApplications";
import DepartmentProgress from "./DepartmentProgress";
import RecentActivity from "./RecentActivity";
import UpcomingItems from "./UpcomingItems";
import QuickActions from "./QuickActions";

const DeptTPODashboard = () => {
  const { data, isLoading, isError, refetch } = useDeptTpoDashboard();

  const dashboard = data?.data ?? data?._data_ ?? data;

  if (isLoading) {
    return (
      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <p className="text-sm text-ink-muted">
            Loading department dashboard...
          </p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl rounded-xl border border-border bg-cream-soft p-6">
          <h1 className="text-lg font-semibold text-ink">
            Unable to load dashboard
          </h1>

          <p className="mt-1 text-sm text-ink-muted">
            We couldn't load your department analytics.
          </p>

          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => refetch()}
          >
            Try again
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <title>Department TPO Dashboard | JGEC Internship Portal</title>
      <meta
        name="description"
        content="Departmental TPO coordinator dashboard for managing internship applications, students, company verification, NOCs, and department internship progress."
      />
      <meta name="robots" content="noindex, nofollow" />
      <meta name="theme-color" content="#f9f6eb" />
      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
            className="flex items-start justify-between gap-4"
          >
            <div>
              <p className="eyebrow">Department TPO workspace</p>

              <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Department internship overview
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                Monitor student internship activity, review applications, track
                NOCs, and keep your department on track.
              </p>
            </div>

            <Button
              variant="outline"
              size="md"
              className="
                hidden
                shrink-0
                border-border
                bg-cream-soft
                text-ink
                hover:bg-cream-dark
                sm:inline-flex
              "
            >
              <Bell size={16} />
              Notifications
            </Button>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <DashboardStats stats={dashboard.stats} />
          </motion.div>

          <div className="grid gap-4 lg:grid-cols-2">
            <ApplicationTrendChart trend={dashboard.trend} />

            <ApplicationStatusChart applications={dashboard.applications} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            <PendingApplications applications={dashboard.pendingApplications} />

            <DepartmentProgress progress={dashboard.progress} />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <UpcomingItems items={dashboard.upcoming} />

            <RecentActivity items={dashboard.recentActivity} />
          </div>

          <QuickActions />
        </div>
      </section>
    </>
  );
};

export default DeptTPODashboard;
