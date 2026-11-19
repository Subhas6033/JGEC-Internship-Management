import { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  FileCheck,
  BriefcaseBusiness,
  ShieldCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
} from "lucide-react";
import { Card, Button } from "../../../../Components/index";

const preferenceGroups = [
  {
    title: "Email Notifications",
    description: "Choose which updates you want to receive.",
    items: [
      {
        key: "emailNotifications",
        label: "Email notifications",
        description: "Receive administrative updates by email.",
        icon: Mail,
      },
      {
        key: "applicationNotifications",
        label: "Application updates",
        description: "Get notified when student applications change.",
        icon: FileCheck,
      },
      {
        key: "nocNotifications",
        label: "NOC notifications",
        description: "Receive NOC generation and dispatch updates.",
        icon: ShieldCheck,
      },
      {
        key: "driveNotifications",
        label: "Internship drive updates",
        description: "Get alerts about newly created and updated drives.",
        icon: BriefcaseBusiness,
      },
      {
        key: "loginAlerts",
        label: "Login alerts",
        description: "Get notified about new account login activity.",
        icon: Bell,
      },
      {
        key: "weeklyReports",
        label: "Weekly reports",
        description: "Receive a weekly summary of portal activity.",
        icon: ChartNoAxesCombined,
      },
    ],
  },
  {
    title: "Dashboard Preferences",
    description: "Customize your administration dashboard.",
    items: [
      {
        key: "compactDashboard",
        label: "Compact dashboard",
        description: "Use a more compact dashboard layout.",
        icon: LayoutDashboard,
      },
    ],
  },
];

const PreferenceSettings = ({ preferences, onSave }) => {
  const [formData, setFormData] = useState(preferences);

  useEffect(() => {
    setFormData(preferences);
  }, [preferences]);

  const handleToggle = (key) => {
    setFormData((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="space-y-5">
      {preferenceGroups.map((group) => (
        <Card
          key={group.title}
          className="border border-border bg-white p-5 shadow-card sm:p-6"
        >
          <div className="mb-5">
            <h2 className="font-semibold text-ink">{group.title}</h2>
            <p className="mt-1 text-sm text-ink-muted">{group.description}</p>
          </div>

          <div className="divide-y divide-border">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.key}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-lg bg-cream-soft p-2 text-brand-600">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">
                        {item.label}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Updated Toggle Button */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={Boolean(formData[item.key])}
                    aria-label={item.label}
                    onClick={() => handleToggle(item.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                      formData[item.key] ? "bg-brand-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        formData[item.key] ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={() => onSave(formData)}>Save Preferences</Button>
      </div>
    </div>
  );
};

export default PreferenceSettings;
