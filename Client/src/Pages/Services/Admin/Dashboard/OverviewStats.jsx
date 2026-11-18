import {
  GraduationCap,
  Building2,
  Users,
  UserCheck,
  BriefcaseBusiness,
  FileCheck2,
  Award,
  Percent,
} from "lucide-react";
import { Card } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import {
  staggerFast,
  fadeUp,
  hoverLiftSmall,
} from "../../../../Animations/animations";

const colorStyles = {
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  green: "bg-green-50 text-green-700",
  amber: "bg-amber-50 text-amber-700",
  violet: "bg-violet-50 text-violet-700",
  rose: "bg-rose-50 text-rose-700",
};

const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <Item variants={fadeUp} whileHover={hoverLiftSmall} className="min-w-0">
      <Card className="h-full overflow-hidden transition-shadow duration-200 hover:shadow-md">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-ink-muted">{stat.title}</p>

              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {stat.display}
              </h3>
            </div>

            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
                colorStyles[stat.color] || colorStyles.blue
              }`}
            >
              <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-muted">{stat.description}</p>
        </div>
      </Card>
    </Item>
  );
};

const num = (v) => Number(v ?? 0);

const OverviewStats = ({ overview = {} }) => {
  const applications = num(overview.totalApplications);
  const selected = num(overview.selectedApplications);
  const rate =
    applications > 0 ? Math.round((selected / applications) * 100) : 0;

  const stats = [
    {
      title: "Total Students",
      value: overview.totalStudents,
      icon: GraduationCap,
      color: "blue",
      description: "Registered students",
    },
    {
      title: "Organisations",
      value: overview.totalOrganisations ?? overview.totalCompanies,
      icon: Building2,
      color: "indigo",
      description: "Registered organisations",
    },
    {
      title: "Total TPOs",
      value: overview.totalTPOs,
      icon: Users,
      color: "violet",
      description: "Registered TPO accounts",
    },
    {
      title: "Total SPOCs",
      value: overview.totalSPOCs,
      icon: UserCheck,
      color: "green",
      description: "Registered SPOC accounts",
    },
    {
      title: "Applications",
      value: applications,
      icon: BriefcaseBusiness,
      color: "blue",
      description: "Submitted in the selected period",
    },
    {
      title: "Pending NOCs",
      value: overview.pendingNOCs,
      icon: FileCheck2,
      color: "amber",
      description: "Awaiting NOC generation",
    },
    {
      title: "Selected",
      value: selected,
      icon: Award,
      color: "green",
      description: "Approved or NOC generated",
    },
    {
      title: "Selection Rate",
      value: rate,
      icon: Percent,
      color: "rose",
      description: "Selected ÷ applications",
      suffix: "%",
    },
  ].map((s) => ({
    ...s,
    display: `${num(s.value).toLocaleString()}${s.suffix ?? ""}`,
  }));

  return (
    <Reveal
      variants={staggerFast}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {stats.map((stat) => (
        <StatCard key={stat.title} stat={stat} />
      ))}
    </Reveal>
  );
};

export default OverviewStats;
