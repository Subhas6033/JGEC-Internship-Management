import { useMemo, useState } from "react";
import {
  Search,
  History,
  Users,
  BriefcaseBusiness,
  FileCheck,
  Building2,
  UserCog,
  Activity,
} from "lucide-react";

import { Card, Input, Select } from "../../../../Components/index";

const categoryIcons = {
  Students: Users,
  "Internship Drives": BriefcaseBusiness,
  "NOC Management": FileCheck,
  Departments: Building2,
  "Staff Management": UserCog,
};

const WorkActivity = ({ activities }) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [
    ...new Set(activities.map((activity) => activity.category)),
  ];

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesSearch =
        !query ||
        activity.action.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query);

      const matchesCategory =
        !categoryFilter || activity.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [activities, search, categoryFilter]);

  return (
    <div className="space-y-5">
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <Activity size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">
              Administrative Work History
            </h2>

            <p className="mt-1 text-sm text-ink-muted">
              Track the actions performed through your administrator account.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Input
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startIcon={<Search size={17} />}
          />

          <Select
            placeholder="All Categories"
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories.map((category) => ({
              label: category,
              value: category,
            }))}
          />
        </div>
      </Card>

      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-center gap-2">
          <History size={19} className="text-brand-600" />
          <h3 className="font-semibold text-ink">
            Recent Administrative Activities
          </h3>
        </div>

        {filteredActivities.length > 0 ? (
          <div className="relative space-y-0">
            {filteredActivities.map((activity, index) => {
              const Icon = categoryIcons[activity.category] || Activity;

              return (
                <div
                  key={activity._id}
                  className="relative flex gap-3 pb-6 last:pb-0"
                >
                  {index !== filteredActivities.length - 1 && (
                    <div className="absolute left-4.75 top-10 h-full w-px bg-border" />
                  )}

                  <div className="z-10 flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream-soft text-brand-600">
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0 flex-1 rounded-xl border border-border p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">
                          {activity.action}
                        </p>

                        <p className="mt-1 text-sm leading-5 text-ink-muted">
                          {activity.description}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        {activity.status}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
                      <span>{activity.category}</span>
                      <span>{activity.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-10 text-center">
            <p className="font-medium text-ink">No activities found</p>
            <p className="mt-1 text-sm text-ink-muted">
              Try another search term or category.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default WorkActivity;
