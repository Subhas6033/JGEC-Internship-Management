import {
  Building2,
  GraduationCap,
  FilePlus2,
  UserPlus,
  ArrowUpRight,
} from "lucide-react";
import { Card } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import {
  staggerFast,
  fadeUp,
  hoverLiftSmall,
  tapScaleSmall,
} from "../../../../Animations/animations";

const actions = [
  {
    id: "company",
    label: "Manage Organisations",
    description: "Manage new/existing organisation",
    icon: Building2,
  },
  {
    id: "student",
    label: "Manage Student",
    description: "Manage Existing student account",
    icon: GraduationCap,
  },
  {
    id: "tpo",
    label: "See TPO",
    description: "See existing TPO",
    icon: UserPlus,
  },
  {
    id: "opportunity",
    label: "Create Opportunity",
    description: "Manage internship listings",
    icon: FilePlus2,
  },
];

const QuickActions = ({ onAction }) => (
  <Card>
    <Card.Header>
      <Card.Title>Quick Actions</Card.Title>
      <p className="text-sm text-ink-muted">
        Frequently used administrative tasks
      </p>
    </Card.Header>

    <Card.Content>
      <Reveal
        variants={staggerFast}
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {actions.map(({ id, label, description, icon: Icon }) => (
          <Item
            as="button"
            variants={fadeUp}
            key={id}
            type="button"
            onClick={() => onAction?.(id)}
            whileHover={hoverLiftSmall}
            whileTap={tapScaleSmall}
            className="group flex min-w-0 items-center gap-3 rounded-xl border border-border bg-cream-soft/50 p-3 text-left transition-colors hover:border-brand-300 hover:bg-cream-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 hover:cursor-pointer"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
              <Icon size={19} aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink">{label}</p>
              <p className="mt-1 text-xs text-ink-muted">{description}</p>
            </div>

            <ArrowUpRight
              size={16}
              aria-hidden="true"
              className="shrink-0 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Item>
        ))}
      </Reveal>
    </Card.Content>
  </Card>
);

export default QuickActions;
