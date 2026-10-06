import { ArrowRight, Building2, FileCheck2, Users } from "lucide-react";
import { Button, Card } from "../../../../Components";

const actions = [
  {
    title: "Manage students",
    description: "View department students",
    icon: Users,
  },

  {
    title: "Review applications",
    description: "Review pending submissions",
    icon: FileCheck2,
  },

  {
    title: "Companies",
    description: "Manage company records",
    icon: Building2,
  },

  {
    title: "Generate report",
    description: "Export department progress",
    icon: FileCheck2,
  },
];

const QuickActions = ({
  onManageStudents,
  onReviewApplications,
  onCompanies,
  onGenerateReport,
}) => {
  const handlers = [
    onManageStudents,
    onReviewApplications,
    onCompanies,
    onGenerateReport,
  ];

  return (
    <Card className="border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Quick actions</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Department management
          </h2>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Common actions for the departmental TPO coordinator.
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {actions.map((action, index) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.title}
                variant="outline"
                size="lg"
                onClick={handlers[index]}
                className="
                  h-auto
                  justify-between
                  border-border
                  bg-transparent
                  px-4
                  py-4
                  text-left
                  hover:bg-cream
                "
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={1.8} />

                  <span>
                    <span className="block text-sm font-semibold">
                      {action.title}
                    </span>

                    <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                      {action.description}
                    </span>
                  </span>
                </span>

                <ArrowRight size={16} strokeWidth={1.8} />
              </Button>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default QuickActions;
