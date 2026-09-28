import { motion } from "motion/react";
import {
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileCheck2,
  GraduationCap,
  MoreHorizontal,
  Users,
  UserRoundCheck,
  XCircle,
} from "lucide-react";

import { Button, Card } from "../../../../Components";
import {
  cardAnimation,
  staggerContainer,
} from "../../../../Animations/animations";

const stats = [
  {
    label: "Total Students",
    value: "128",
    description: "Students under your department",
    icon: Users,
    tone: "brand",
  },
  {
    label: "Active Internships",
    value: "94",
    description: "Currently in progress",
    icon: GraduationCap,
    tone: "info",
  },
  {
    label: "Pending Approvals",
    value: "17",
    description: "Applications need review",
    icon: FileCheck2,
    tone: "warning",
  },
  {
    label: "Placement Rate",
    value: "73.4%",
    description: "Students placed this cycle",
    icon: UserRoundCheck,
    tone: "success",
  },
];

const pendingApplications = [
  {
    id: "INT-2026-041",
    name: "Aarav Sen",
    roll: "CSE/22/041",
    company: "TCS",
    role: "Software Engineering Intern",
    submitted: "Today, 10:42 AM",
  },
  {
    id: "INT-2026-038",
    name: "Riya Das",
    roll: "CSE/22/038",
    company: "Deloitte",
    role: "Technology Consulting Intern",
    submitted: "Yesterday, 4:18 PM",
  },
  {
    id: "INT-2026-032",
    name: "Soham Roy",
    roll: "CSE/22/032",
    company: "Cognizant",
    role: "Frontend Development Intern",
    submitted: "Yesterday, 1:26 PM",
  },
  {
    id: "INT-2026-027",
    name: "Priya Ghosh",
    roll: "CSE/22/027",
    company: "Accenture",
    role: "Cloud Engineering Intern",
    submitted: "Sep 25, 2026",
  },
];

const departmentProgress = [
  {
    label: "Internship applications",
    completed: 91,
    total: 100,
  },
  {
    label: "NOC verification",
    completed: 78,
    total: 100,
  },
  {
    label: "Company verification",
    completed: 64,
    total: 100,
  },
  {
    label: "Joining confirmation",
    completed: 52,
    total: 100,
  },
];

const upcomingItems = [
  {
    title: "Company verification deadline",
    date: "Sep 30",
    meta: "12 applications pending",
    icon: Building2,
  },
  {
    title: "Internship progress review",
    date: "Oct 03",
    meta: "Department review meeting",
    icon: CalendarDays,
  },
  {
    title: "Monthly TPO report",
    date: "Oct 05",
    meta: "Report submission deadline",
    icon: FileCheck2,
  },
];

const recentActivity = [
  {
    title: "NOC approved",
    description: "Ananya Paul · Infosys",
    time: "18 min ago",
    icon: CheckCircle2,
    tone: "success",
  },
  {
    title: "Application returned",
    description: "Rahul Das · Wipro",
    time: "42 min ago",
    icon: XCircle,
    tone: "danger",
  },
  {
    title: "New application received",
    description: "Aarav Sen · TCS",
    time: "1 hr ago",
    icon: FileCheck2,
    tone: "brand",
  },
  {
    title: "Company verification updated",
    description: "Cognizant · CSE department",
    time: "2 hrs ago",
    icon: Building2,
    tone: "info",
  },
];

const toneStyles = {
  brand: {
    wrapper: "bg-brand-50 text-brand-700",
    icon: "text-brand-700",
  },
  success: {
    wrapper: "bg-brand-50 text-success",
    icon: "text-success",
  },
  warning: {
    wrapper: "bg-amber-50 text-warning",
    icon: "text-warning",
  },
  info: {
    wrapper: "bg-sky-50 text-info",
    icon: "text-info",
  },
  danger: {
    wrapper: "bg-red-50 text-danger",
    icon: "text-danger",
  },
};

const StatCard = ({ item }) => {
  const Icon = item.icon;
  const styles = toneStyles[item.tone] ?? toneStyles.brand;

  return (
    <Card
      className="
        border-border
        bg-cream-soft
        p-5
        shadow-card
        transition-shadow
        duration-200
        hover:shadow-card-hover
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-ink-muted">{item.label}</p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">
            {item.value}
          </p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            {item.description}
          </p>
        </div>

        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${styles.wrapper}`}
        >
          <Icon size={19} strokeWidth={1.8} className={styles.icon} />
        </div>
      </div>
    </Card>
  );
};

const SectionHeader = ({ eyebrow, title, description, action }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}

        <h2 className="mt-1 text-lg font-semibold tracking-tight text-ink">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-ink-muted">{description}</p>
        )}
      </div>

      {action}
    </div>
  );
};

const ProgressRow = ({ item }) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-ink">{item.label}</span>

        <span className="text-xs font-semibold text-ink-muted">
          {item.completed}%
        </span>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-dark">
        <div
          className="h-full rounded-full bg-brand-700 transition-all duration-500"
          style={{ width: `${item.completed}%` }}
        />
      </div>
    </div>
  );
};

const DeptTPODashboard = () => {
  return (
    <>
      <title>Department TPO Dashboard | JGEC Internship Portal</title>

      <meta
        name="description"
        content="Departmental TPO coordinator dashboard for managing internship applications, students, company verification, NOCs, and department internship progress."
      />

      <meta name="robots" content="noindex, nofollow" />

      <meta name="theme-color" content="#f9f6eb" />

      <section className="w-full px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          {/* Header */}
          <motion.div
            variants={cardAnimation}
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Department TPO workspace</p>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div>
                    <h1
                      className="
                        font-display
                        text-3xl
                        leading-tight
                        tracking-tight
                        text-ink
                        sm:text-4xl
                      "
                    >
                      Department internship overview
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
                      Monitor student internship activity, review applications,
                      verify companies, and keep your department on track.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="md"
                className="
                  hidden
                  shrink-0
                  border-border
                  bg-cream-soft
                  text-ink
                  hover:bg-cream-dark
                  sm:inline-flex
                "
              >
                <Bell size={16} strokeWidth={1.8} />
                Notifications
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </motion.div>

          {/* Main overview */}
          <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
            {/* Pending approvals */}
            <Card className="border-border bg-cream-soft shadow-card">
              <Card.Header className="border-b border-border">
                <SectionHeader
                  eyebrow="Requires attention"
                  title="Pending applications"
                  description="Applications submitted by students awaiting departmental review."
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="
                        shrink-0
                        text-brand-700
                        hover:bg-brand-50
                        hover:text-brand-800
                      "
                    >
                      View all
                      <ArrowRight size={15} strokeWidth={1.8} />
                    </Button>
                  }
                />
              </Card.Header>

              <Card.Content className="p-0">
                <div className="divide-y divide-border">
                  {pendingApplications.map((application) => (
                    <div
                      key={application.id}
                      className="
                        group
                        flex
                        flex-col
                        gap-4
                        px-5
                        py-4
                        transition-colors
                        hover:bg-cream
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                      "
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className="
                            flex
                            size-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-cream-dark
                            text-xs
                            font-semibold
                            text-ink
                          "
                        >
                          {application.name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-semibold text-ink">
                              {application.name}
                            </p>

                            <span className="rounded-full bg-cream-dark px-2 py-0.5 text-[10px] font-semibold text-ink-muted">
                              {application.roll}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-ink-muted">
                            {application.company} · {application.role}
                          </p>

                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-ink-muted">
                            <Clock3 size={12} strokeWidth={1.8} />
                            {application.submitted}
                          </div>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="
                            border-border
                            bg-transparent
                            hover:bg-cream-dark
                          "
                        >
                          Review
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="
                            size-8
                            p-0!
                            text-ink-muted
                            hover:bg-cream-dark
                          "
                          aria-label={`More actions for ${application.name}`}
                        >
                          <MoreHorizontal size={17} strokeWidth={1.8} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Content>
            </Card>

            {/* Department progress */}
            <Card className="border-border bg-cream-soft shadow-card">
              <Card.Header>
                <SectionHeader
                  eyebrow="Department progress"
                  title="Internship cycle"
                  description="Current completion across the department workflow."
                />
              </Card.Header>

              <Card.Content className="space-y-6">
                {departmentProgress.map((item) => (
                  <ProgressRow key={item.label} item={item} />
                ))}

                <div
                  className="
                    rounded-lg
                    border
                    border-brand-200
                    bg-brand-50
                    p-4
                  "
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-white
                        text-brand-700
                      "
                    >
                      <CheckCircle2 size={17} strokeWidth={1.8} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-brand-900">
                        Good progress this cycle
                      </p>

                      <p className="mt-1 text-xs leading-5 text-brand-700">
                        Most student applications have completed the initial
                        departmental review.
                      </p>
                    </div>
                  </div>
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Lower content */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Upcoming */}
            <Card className="border-border bg-cream-soft shadow-card lg:col-span-1">
              <Card.Header>
                <SectionHeader
                  eyebrow="Schedule"
                  title="Upcoming"
                  description="Important departmental dates."
                />
              </Card.Header>

              <Card.Content className="space-y-2">
                {upcomingItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      type="button"
                      key={item.title}
                      className="
                        focus-ring
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        p-3
                        text-left
                        transition-colors
                        hover:bg-cream
                      "
                    >
                      <div
                        className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-cream-dark
                          text-ink
                        "
                      >
                        <Icon size={17} strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">
                          {item.title}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-ink-muted">
                          {item.meta}
                        </p>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-brand-700">
                        {item.date}
                      </span>
                    </button>
                  );
                })}
              </Card.Content>
            </Card>

            {/* Recent activity */}
            <Card className="border-border bg-cream-soft shadow-card lg:col-span-2">
              <Card.Header>
                <SectionHeader
                  eyebrow="Activity"
                  title="Recent activity"
                  description="Latest updates from your department."
                  action={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="
                        text-brand-700
                        hover:bg-brand-50
                        hover:text-brand-800
                      "
                    >
                      Activity log
                      <ChevronRight size={15} strokeWidth={1.8} />
                    </Button>
                  }
                />
              </Card.Header>

              <Card.Content className="p-0">
                <div className="divide-y divide-border">
                  {recentActivity.map((item) => {
                    const Icon = item.icon;
                    const styles = toneStyles[item.tone] ?? toneStyles.brand;

                    return (
                      <div
                        key={`${item.title}-${item.time}`}
                        className="
                          flex
                          items-center
                          gap-3
                          px-5
                          py-4
                        "
                      >
                        <div
                          className={`
                            flex
                            size-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            ${styles.wrapper}
                          `}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.8}
                            className={styles.icon}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-ink">
                            {item.title}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-ink-muted">
                            {item.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-[11px] text-ink-muted">
                          {item.time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          </div>

          {/* Quick actions */}
          <Card className="border-border bg-cream-soft shadow-card">
            <Card.Header>
              <SectionHeader
                eyebrow="Quick actions"
                title="Department management"
                description="Common actions for the departmental TPO coordinator."
              />
            </Card.Header>

            <Card.Content>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Button
                  variant="outline"
                  size="lg"
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
                    <Users size={18} strokeWidth={1.8} />
                    <span>
                      <span className="block text-sm font-semibold">
                        Manage students
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                        View department students
                      </span>
                    </span>
                  </span>

                  <ArrowRight size={16} strokeWidth={1.8} />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
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
                    <FileCheck2 size={18} strokeWidth={1.8} />
                    <span>
                      <span className="block text-sm font-semibold">
                        Review applications
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                        Review pending submissions
                      </span>
                    </span>
                  </span>

                  <ArrowRight size={16} strokeWidth={1.8} />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
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
                    <Building2 size={18} strokeWidth={1.8} />
                    <span>
                      <span className="block text-sm font-semibold">
                        Companies
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                        Manage company records
                      </span>
                    </span>
                  </span>

                  <ArrowRight size={16} strokeWidth={1.8} />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
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
                    <FileCheck2 size={18} strokeWidth={1.8} />
                    <span>
                      <span className="block text-sm font-semibold">
                        Generate report
                      </span>
                      <span className="mt-0.5 block text-xs font-normal text-ink-muted">
                        Export department progress
                      </span>
                    </span>
                  </span>

                  <ArrowRight size={16} strokeWidth={1.8} />
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>
    </>
  );
};

export default DeptTPODashboard;
