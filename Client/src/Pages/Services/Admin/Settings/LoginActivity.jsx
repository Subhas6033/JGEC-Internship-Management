import { useMemo, useState } from "react";
import {
  Monitor,
  Smartphone,
  Search,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

import { Card, Input, Select } from "../../../../Components/index";

const LoginActivity = ({ activities }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredActivities = useMemo(() => {
    const query = search.toLowerCase().trim();

    return activities.filter((item) => {
      const matchesSearch =
        !query ||
        item.device.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.ipAddress.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [activities, search, statusFilter]);

  const successfulCount = activities.filter(
    (item) => item.status === "Current" || item.status === "Successful",
  ).length;

  const failedCount = activities.filter(
    (item) => item.status === "Failed",
  ).length;

  const statusClass = (status) => {
    if (status === "Current") return "bg-green-50 text-green-700";
    if (status === "Successful") return "bg-blue-50 text-blue-700";
    return "bg-red-50 text-red-600";
  };

  return (
    <div className="space-y-5">
      {/* Login Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Successful Logins</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">
                {successfulCount}
              </h3>
            </div>

            <div className="rounded-xl bg-green-50 p-3 text-green-700">
              <ShieldCheck size={22} />
            </div>
          </div>
        </Card>

        <Card className="border border-border bg-white p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-muted">Failed Logins</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">
                {failedCount}
              </h3>
            </div>

            <div className="rounded-xl bg-red-50 p-3 text-red-600">
              <AlertCircle size={22} />
            </div>
          </div>
        </Card>
      </div>

      {/* Login History */}
      <Card className="min-w-0 overflow-hidden border border-border bg-white shadow-card">
        <div className="space-y-4 border-b border-border p-5">
          <div>
            <h2 className="font-semibold text-ink">Login History</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Review when and where your account was accessed.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              placeholder="Search device, IP, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startIcon={<Search size={17} />}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All Login Statuses"
              options={[
                { label: "Current", value: "Current" },
                { label: "Successful", value: "Successful" },
                { label: "Failed", value: "Failed" },
              ]}
            />
          </div>
        </div>

        <div className="divide-y divide-border">
          {filteredActivities.map((activity) => (
            <div
              key={activity._id}
              className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-cream-soft p-3 text-ink-muted">
                  {activity.device.toLowerCase().includes("android") ? (
                    <Smartphone size={21} />
                  ) : (
                    <Monitor size={21} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {activity.device}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    {activity.location}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    IP: {activity.ipAddress}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">{activity.date}</p>
                </div>
              </div>

              <span
                className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                  activity.status,
                )}`}
              >
                {activity.status}
              </span>
            </div>
          ))}

          {filteredActivities.length === 0 && (
            <div className="p-8 text-center">
              <p className="font-medium text-ink">No login activity found</p>
              <p className="mt-1 text-sm text-ink-muted">
                Try changing your search or status filter.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LoginActivity;
