import DashboardWelcome from "./DashboardWelcome";
import DashboardStats from "./DashboardStats";
import RecentApplications from "./RecentApplications";
import QuickActions from "./QuickActions";
import ActivityCard from "./ActivityCard";
import SystemStatus from "./SystemStatus";

const AdminDashboard = () => {
  return (
    <div>
      <DashboardWelcome />

      <DashboardStats />

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
        <RecentApplications />

        <div className="space-y-6">
          <QuickActions />
          <ActivityCard />
        </div>
      </section>

      <SystemStatus />
    </div>
  );
};

export default AdminDashboard;
