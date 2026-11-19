import { Users, FileText, BriefcaseBusiness, FileBarChart } from "lucide-react";

const actions = [
  {
    title: "Manage Students",
    description: "View and manage students",
    icon: Users,
    page: "students",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Applications",
    description: "Review student applications",
    icon: FileText,
    page: "applications",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Internships",
    description: "Explore opportunities",
    icon: BriefcaseBusiness,
    page: "opportunities",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Placement Reports",
    description: "View placement analytics",
    icon: FileBarChart,
    page: "reports",
    color: "bg-amber-100 text-amber-600",
  },
];

const QuickActions = ({ onNavigate }) => {
  return (
    <section>
      <div className="mb-4">
        <h3 className="font-semibold text-ink">Quick Actions</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Frequently used dashboard sections
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.page}
              type="button"
              onClick={() => onNavigate?.(action.page)}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${action.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{action.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
