import DashboardHeader from "./DashboardHeader";
import StatsOverview from "./StatsOverview";
import ApplicationStatusChart from "./ApplicationStatusChart";
import MonthlyApplicationsChart from "./MonthlyApplicationsChart";
import PlacementProgress from "./PlacementProgress";
import RecentApplications from "./RecentApplications";
import PendingTasks from "./PendingTasks";
import QuickActions from "./QuickActions";
import { useSpocDashboard } from "../../../../Services/Queries/spocDashboard.queries";
import { Card } from "../../../../Components/index";

const SPOCDashboard = ({ onNavigate }) => {
  const { data: dashboardData, isLoading, isError, error } = useSpocDashboard();

  if (isLoading) {
    return (
      <div className="min-h-screen space-y-8 bg-cream-soft p-4 sm:p-6 lg:p-8">
        <div className="flex min-h-96 items-center justify-center">
          <p className="text-sm text-ink-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen space-y-8 bg-cream-soft p-4 sm:p-6 lg:p-8">
        <div className="px-4 py-8">
          <Card className="border-red-200 bg-red-50">
            <Card.Content className="p-6">
              <p className="text-sm font-semibold text-red-700">
                Failed to load dashboard
              </p>
              <p className="mt-1 text-xs text-red-600">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong"}
              </p>
            </Card.Content>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-8 bg-cream-soft p-4 sm:p-6 lg:p-8">
      {/* Dashboard Header */}
      <DashboardHeader onNavigate={onNavigate} />

      {/* Overview Statistics */}
      <StatsOverview data={dashboardData} />

      {/* Application and Placement Analytics */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink">
            Placement Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Application trends and placement performance
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <ApplicationStatusChart data={dashboardData?.applicationStatus} />
          <MonthlyApplicationsChart data={dashboardData?.monthlyApplications} />
        </div>
      </section>

      {/* Placement Progress */}
      <section>
        <PlacementProgress data={dashboardData?.placementStats} />
      </section>

      {/* Recent Applications */}
      <RecentApplications
        data={dashboardData?.recentApplications}
        onViewAll={() => onNavigate?.("applications")}
      />

      {/* Tasks and Deadlines */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <PendingTasks
          data={dashboardData?.pendingTasks}
          onViewAll={() => onNavigate?.("applications")}
        />
      </section>

      {/* Quick Actions */}
      <QuickActions onNavigate={onNavigate} />
    </div>
  );
};

export default SPOCDashboard;
