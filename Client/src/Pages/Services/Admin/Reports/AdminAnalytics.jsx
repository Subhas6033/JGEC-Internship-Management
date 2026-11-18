import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  BriefcaseBusiness,
  Download,
  Activity,
} from "lucide-react";

import { Card, Button } from "../../../../Components/index";

import AnalyticsStatCard from "./AnalyticsStatCard";
import AnalyticsFilters from "./AnalyticsFilters";
import ApplicationTrendChart from "./ApplicationTrendChart";
import ApplicationStatusChart from "./ApplicationStatusChart";
import DepartmentDistributionChart from "./DepartmentDistributionChart";
import DrivePerformanceChart from "./DrivePerformanceChart";
import RecentActivityTable from "./RecentActivityTable";

import { useAdminAnalytics } from "../../../../Services/Queries/adminAnalytics.queries";

import { exportCSV } from "./analytics.utils";

import {
  pageAnimation,
  staggerContainer,
  useAnimationVariants,
} from "../../../../Animations/animations";

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("12m");

  const { data: analytics, isLoading, error } = useAdminAnalytics(period);

  const pageVariants = useAnimationVariants(pageAnimation);
  const staggerVariants = useAnimationVariants(staggerContainer);

  // FIX: normalize whatever AnalyticsFilters sends (string, event, option element,
  // or { value } object) into a plain string so the React Query key stays serializable.
  const handlePeriodChange = (value) => {
    const next =
      typeof value === "string"
        ? value
        : (value?.target?.value ?? value?.value);

    if (typeof next === "string") setPeriod(next);
  };

  const summary = analytics?.summary || {
    totalStudents: 0,
    applications: 0,
    placementRate: 0,
    activeDrives: 0,
    studentChange: "+0%",
    applicationChange: "+0%",
    placementChange: "+0%",
    driveChange: "+0",
  };

  const trendData = analytics?.applicationTrend || {
    labels: [],
    applications: [],
    approved: [],
  };
  const applicationStatusData = analytics?.applicationStatus || {
    labels: [],
    values: [],
  };
  const departmentDistributionData = analytics?.departmentDistribution || {
    labels: [],
    values: [],
  };
  const drivePerformanceData = analytics?.drivePerformance || {
    labels: [],
    applications: [],
    selected: [],
  };
  const recentActivities = analytics?.recentActivities || [];

  const stats = useMemo(
    () => [
      {
        title: "Total Students",
        value: summary.totalStudents.toLocaleString(),
        icon: "students",
        change: summary.studentChange,
        description: "vs previous period",
      },
      {
        title: "Applications",
        value: summary.applications.toLocaleString(),
        icon: "applications",
        change: summary.applicationChange,
        description: "vs previous period",
      },
      {
        title: "Placement Rate",
        value: summary.placementRate,
        suffix: "%",
        icon: "placement",
        change: summary.placementChange,
        description: "vs previous period",
      },
      {
        title: "Active Drives",
        value: summary.activeDrives,
        icon: "drives",
        change: summary.driveChange,
        description: "vs previous period",
      },
    ],
    [summary],
  );

  const handleExport = () => {
    if (!analytics) return;

    const rows = [
      ...stats.map((stat) => ({
        Metric: stat.title,
        Value: `${stat.value}${stat.suffix || ""}`,
        Change: stat.change,
        Period: period,
      })),

      ...trendData.labels.map((label, index) => ({
        Metric: "Application Trend",
        Period: label,
        Applications: trendData.applications[index],
        Approved: trendData.approved[index],
      })),

      ...applicationStatusData.labels.map((label, index) => ({
        Metric: "Application Status",
        Status: label,
        Count: applicationStatusData.values[index],
      })),

      ...departmentDistributionData.labels.map((label, index) => ({
        Metric: "Department Distribution",
        Department: label,
        Students: departmentDistributionData.values[index],
      })),

      ...drivePerformanceData.labels.map((label, index) => ({
        Metric: "Drive Performance",
        Company: label,
        Applications: drivePerformanceData.applications[index],
        Selected: drivePerformanceData.selected[index],
      })),
    ];

    exportCSV(`jgec-analytics-${period}.csv`, rows);
  };

  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
      >
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
              <BarChart3 size={25} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Analytics & Reports
              </h1>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                Monitor student applications, internship drives, and department
                performance.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Show error state
  if (error) {
    return (
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
      >
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
              <BarChart3 size={25} />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
                Analytics & Reports
              </h1>
              <p className="mt-1 text-sm leading-6 text-ink-muted">
                Monitor student applications, internship drives, and department
                performance.
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
          Failed to load analytics data. Please try again.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen space-y-6 bg-cream-soft/40 p-4 sm:p-6 lg:p-8"
    >
      {/* Page Header */}
      <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className="shrink-0 rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <BarChart3 size={25} />
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
              Analytics & Reports
            </h1>

            <p className="mt-1 text-sm leading-6 text-ink-muted">
              Monitor student applications, internship drives, and department
              performance.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <AnalyticsFilters
            period={period}
            onPeriodChange={handlePeriodChange}
            onExport={handleExport}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <motion.section
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
        className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <AnalyticsStatCard key={stat.title} stat={stat} index={index} />
        ))}
      </motion.section>

      {/* Main Charts */}
      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="min-w-0 xl:col-span-2">
          <ApplicationTrendChart data={trendData} />
        </div>

        <div className="min-w-0">
          <ApplicationStatusChart data={applicationStatusData} />
        </div>
      </section>

      {/* Department and Drive Charts */}
      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
        <DepartmentDistributionChart data={departmentDistributionData} />

        <DrivePerformanceChart data={drivePerformanceData} />
      </section>

      {/* Recent Activity */}
      <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-brand-600/10 p-2.5 text-brand-600">
              <Activity size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-ink">Recent Activity</h2>

              <p className="mt-1 text-xs text-ink-muted">
                Latest administrative and internship activities
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="w-full sm:w-auto"
          >
            <Download size={15} className="mr-2" />
            Export Data
          </Button>
        </div>

        <div className="min-w-0 p-3 sm:p-5">
          <RecentActivityTable activities={recentActivities} />
        </div>
      </Card>
    </motion.div>
  );
};

export default AdminAnalytics;
