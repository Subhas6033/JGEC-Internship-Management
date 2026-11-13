import { ArrowRight, FileCheck2, ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, Button } from "../../../../Components";

const actions = [
  {
    title: "Review applications",
    description: "Review pending submissions",
    icon: FileCheck2,
    slug: "/depttpo/applications/pending",
    tone: "bg-brand-50 text-brand-700",
    callbackKey: "onReviewApplications",
  },
  {
    title: "Generate report",
    description: "View department progress and statistics",
    icon: ChartNoAxesCombined,
    slug: "/depttpo/stats",
    tone: "bg-violet-50 text-violet-700",
    callbackKey: "onGenerateReport",
  },
];

const QuickActions = ({ onReviewApplications, onGenerateReport }) => {
  const navigate = useNavigate();

  const handlers = {
    onReviewApplications,
    onGenerateReport,
  };

  const handleAction = (action) => {
    const callback = handlers[action.callbackKey];

    if (typeof callback === "function") {
      callback();
      return;
    }

    navigate(action.slug);
  };

  return (
    <Card className="w-full min-w-0 border-border bg-cream-soft shadow-card">
      <Card.Header>
        <div>
          <p className="eyebrow">Quick actions</p>

          <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
            Department management
          </h2>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Access the essential tools for managing your department.
          </p>
        </div>
      </Card.Header>

      <Card.Content>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Button
                key={action.title}
                type="button"
                variant="outline"
                size="lg"
                onClick={() => handleAction(action)}
                className="
                  group
                  flex
                  h-auto
                  min-h-28
                  w-full
                  items-center
                  justify-between
                  gap-4
                  rounded-xl
                  border-border
                  bg-white
                  px-5
                  py-5
                  text-left
                  shadow-sm
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-brand-300
                  hover:bg-white
                  hover:shadow-card
                  focus-visible:ring-2
                  focus-visible:ring-brand-500
                "
              >
                <span className="flex min-w-0 items-center gap-4">
                  <span
                    className={`
                      flex size-12 shrink-0 items-center justify-center
                      rounded-xl transition-transform duration-200
                      group-hover:scale-105
                      ${action.tone}
                    `}
                  >
                    <Icon size={22} strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-ink">
                      {action.title}
                    </span>

                    <span className="mt-1 block text-xs font-normal leading-5 text-ink-muted">
                      {action.description}
                    </span>
                  </span>
                </span>

                <ArrowRight
                  size={18}
                  strokeWidth={1.8}
                  className="
                    shrink-0
                    text-ink-muted
                    transition-all
                    duration-200
                    group-hover:translate-x-1
                    group-hover:text-brand-700
                  "
                />
              </Button>
            );
          })}
        </div>
      </Card.Content>
    </Card>
  );
};

export default QuickActions;
