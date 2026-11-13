import {
  Building2,
  GraduationCap,
  FilePlus2,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";

import { Card } from "../../../../Components/index";

const actions = [
  {
    label: "Add Company",
    description: "Register a new company",
    icon: Building2,
  },
  {
    label: "Add Student",
    description: "Create a student account",
    icon: GraduationCap,
  },
  {
    label: "Add TPO",
    description: "Assign department TPO",
    icon: UserPlus,
  },
  {
    label: "Create Opportunity",
    description: "Manage internship listings",
    icon: FilePlus2,
  },
];

const QuickActions = () => {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick Actions</Card.Title>
        <p className="text-sm text-ink-muted">
          Frequently used administrative tasks
        </p>
      </Card.Header>

      <Card.Content className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.label}
              type="button"
              // onClick={() => onAction?.(action.label)}
              className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-cream-soft/50 p-3 text-left transition-colors hover:border-brand-300 hover:bg-cream-soft"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{action.label}</p>
                <p className="mt-1 text-xs text-ink-muted">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </button>
          );
        })}
      </Card.Content>
    </Card>
  );
};

export default QuickActions;
