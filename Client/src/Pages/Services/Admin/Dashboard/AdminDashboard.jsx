import { memo, useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  BriefcaseBusiness,
  FileCheck2,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { Card, Button } from "../../../../Components/index";
import {
  pageAnimation,
  sectionAnimation,
  scaleIn,
  popIn,
  heroContainer,
  heroItem,
} from "../../../../Animations/animations";
import DashboardHeader from "./DashboardHeader";
import OverviewStats from "./OverviewStats";
import InternshipAnalytics from "./InternshipAnalytics";
import DepartmentOverview from "./DepartmentOverview";
import PendingNOCs from "./PendingNOCs";
import RecentActivities from "./RecentActivities";
import QuickActions from "./QuickActions";
import { Reveal, Item } from "./MotionBlocks.jsx";
import {
  ALL_SESSIONS,
  buildSessionOptions,
  formatSession,
  getCoverageLabel,
  getCurrentSession,
  getSessionsFromAnalytics,
} from "./dashboard.utils";
import { useAdminDashboard } from "../../../../Services/Queries/adminDashboard.quires";

// Config Routes
const ROUTES = {
  nocs: "/admin/nocs",
  organisations: "/admin/org",
  quickActions: {
    company: "/admin/org",
    student: "/admin/students",
    tpo: "/admin/staff-management",
    opportunity: "/admin/opportunities/new",
  },
};

const EMPTY_ARRAY = [];
const EMPTY_OBJECT = {};

/** Supports both a direct dashboard payload and a wrapped API response. */
const unwrapDashboard = (response) =>
  response?.data?.dashboard ||
  response?.data ||
  response?.dashboard ||
  response ||
  null;

const asArray = (value) => (Array.isArray(value) ? value : EMPTY_ARRAY);

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong while fetching dashboard data.";

/* ------------------------- Layout primitives ------------------------ */

const PageShell = ({ children, centered = false }) => (
  <main className="min-h-full min-w-0 bg-cream p-4 sm:p-6 lg:p-8">
    <div
      className={
        centered
          ? "mx-auto flex min-h-[70vh] w-full max-w-md items-center justify-center"
          : "mx-auto w-full max-w-[1600px] space-y-6"
      }
    >
      {children}
    </div>
  </main>
);

/* A single placeholder bar with a moving highlight. */
const Bone = ({ className = "" }) => {
  const reduce = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden rounded-md bg-brand-100 ${className}`}
    >
      {!reduce && (
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/70 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.4,
            ease: "linear",
            repeat: Infinity,
            repeatDelay: 0.2,
          }}
        />
      )}
    </div>
  );
};

/* White card shell so the skeleton matches the real cards. */
const SkeletonCard = ({ className = "", children }) => (
  <div
    aria-hidden="true"
    className={`rounded-xl border border-border bg-white p-5 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const BAR_HEIGHTS = [40, 65, 50, 80, 55, 90, 70, 60];

const DashboardSkeleton = () => (
  <PageShell>
    <div role="status" aria-live="polite" className="space-y-6">
      <span className="sr-only">Loading admin dashboard…</span>

      {/* Header */}
      <div className="space-y-3">
        <Bone className="h-3 w-40" />
        <Bone className="h-8 w-64" />
        <Bone className="h-3 w-80 max-w-full" />
      </div>

      {/* Welcome banner */}
      <SkeletonCard className="p-7">
        <Bone className="mb-4 h-6 w-44 rounded-full!" />
        <Bone className="mb-3 h-7 w-72 max-w-full" />
        <Bone className="mb-5 h-3 w-96 max-w-full" />
        <div className="flex gap-3">
          <Bone className="h-10 w-32 rounded-lg!" />
          <Bone className="h-10 w-36 rounded-lg!" />
        </div>
      </SkeletonCard>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i}>
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <Bone className="h-3 w-24" />
                <Bone className="h-8 w-16" />
              </div>
              <Bone className="size-11 rounded-xl!" />
            </div>
            <Bone className="mt-5 h-3 w-32" />
          </SkeletonCard>
        ))}
      </div>

      {/* Chart + departments */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SkeletonCard className="xl:col-span-2">
          <Bone className="mb-2 h-5 w-48" />
          <Bone className="mb-8 h-3 w-64" />
          <div className="flex h-48 items-end gap-4 border-b border-border pb-2">
            {BAR_HEIGHTS.map((h, i) => (
              <Bone
                key={i}
                className="flex-1 rounded-b-none!"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <Bone className="mb-2 h-5 w-44" />
          <Bone className="mb-6 h-3 w-52" />
          <div className="space-y-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <Bone className="h-3 w-28" />
                <Bone className="h-2 w-full rounded-full!" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>

      {/* Table + activity */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <SkeletonCard className="xl:col-span-2">
          <Bone className="mb-2 h-5 w-52" />
          <Bone className="mb-6 h-3 w-64" />
          <div className="space-y-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <div className="space-y-2">
                  <Bone className="h-3 w-36" />
                  <Bone className="h-3 w-24" />
                </div>
                <Bone className="hidden h-3 w-40 sm:block" />
                <Bone className="h-6 w-24 rounded-full!" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard>
          <Bone className="mb-2 h-5 w-40" />
          <Bone className="mb-6 h-3 w-48" />
          <div className="space-y-5">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Bone className="size-10 shrink-0 rounded-xl!" />
                <div className="flex-1 space-y-2">
                  <Bone className="h-3 w-3/4" />
                  <Bone className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  </PageShell>
);

const StateCard = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  actionDisabled,
  tone = "neutral",
}) => (
  <PageShell centered>
    <Reveal variants={scaleIn} className="w-full">
      <Card
        className={`w-full p-6 text-center ${tone === "error" ? "border-red-200 bg-white" : "bg-white"}`}
      >
        <div role={tone === "error" ? "alert" : "status"}>
          {Icon && (
            <div
              className={`mx-auto mb-4 flex size-12 items-center justify-center rounded-full ${
                tone === "error"
                  ? "bg-red-50 text-red-600"
                  : "bg-brand-50 text-brand-700"
              }`}
            >
              <Icon size={22} aria-hidden="true" />
            </div>
          )}
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-2 text-sm text-ink-muted">{message}</p>
        </div>

        <button
          type="button"
          onClick={onAction}
          disabled={actionDisabled}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-medium text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={15}
            aria-hidden="true"
            className={
              actionDisabled ? "animate-spin motion-reduce:animate-none" : ""
            }
          />
          {actionLabel}
        </button>
      </Card>
    </Reveal>
  </PageShell>
);

/* --------------------------- Welcome banner ------------------------- */

const floatingIcon =
  "absolute flex items-center justify-center rounded-xl border border-border bg-white shadow-sm";

const WelcomeBanner = memo(function WelcomeBanner({
  sessionLabel,
  onManageNOCs,
  onViewOrganisations,
}) {
  return (
    <Reveal variants={heroContainer}>
      <Card className="overflow-hidden border-brand-200/60 bg-white">
        <Card.Content className="flex items-center justify-between gap-8 p-5 sm:p-7">
          <div className="min-w-0 max-w-xl">
            <Item variants={heroItem}>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                <span
                  className="size-2 rounded-full bg-green-500"
                  aria-hidden="true"
                />
                {sessionLabel}
              </div>
            </Item>

            <Item variants={heroItem}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                Welcome to the Administration Portal
              </h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-ink-muted">
                Manage organisations, students, NOC requests and internship
                activities from one workspace.
              </p>
            </Item>

            <Item
              variants={heroItem}
              className="mt-5 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                type="button"
                onClick={onManageNOCs}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white transition-colors hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                Manage NOCs
                <ArrowUpRight size={16} aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onViewOrganisations}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-medium text-ink transition-colors hover:bg-cream-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
              >
                View organisations
              </Button>
            </Item>
          </div>

          <div
            aria-hidden="true"
            className="relative mr-4 hidden size-52 shrink-0 items-center justify-center md:flex"
          >
            <div className="absolute size-48 rounded-full bg-brand-50" />
            <div className="absolute size-36 rounded-full border border-brand-100" />

            <Item
              variants={popIn}
              className="relative flex size-28 items-center justify-center rounded-3xl border border-brand-100 bg-white shadow-card"
            >
              <GraduationCap
                size={58}
                strokeWidth={1.3}
                className="text-brand-700"
              />
            </Item>

            <Item
              variants={popIn}
              className={`${floatingIcon} right-1 top-2 size-11`}
            >
              <Building2 size={21} className="text-brand-700" />
            </Item>
            <Item
              variants={popIn}
              className={`${floatingIcon} bottom-1 left-1 size-11`}
            >
              <BriefcaseBusiness size={21} className="text-green-600" />
            </Item>
            <Item
              variants={popIn}
              className={`${floatingIcon} bottom-3 right-0 size-10`}
            >
              <FileCheck2 size={19} className="text-amber-600" />
            </Item>
          </div>
        </Card.Content>
      </Card>
    </Reveal>
  );
});

/* ------------------------------- Page ------------------------------- */

const GridCell = ({ className = "", children }) => (
  <Reveal
    variants={sectionAnimation}
    className={`min-w-0 *:h-full ${className}`}
  >
    {children}
  </Reveal>
);

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [session, setSession] = useState(ALL_SESSIONS);
  const [dateRange, setDateRange] = useState("12-months");

  const queryParams = useMemo(
    () =>
      session === ALL_SESSIONS
        ? { dateRange }
        : { dateRange, academicSession: session },
    [session, dateRange],
  );

  const {
    data: dashboardResponse,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useAdminDashboard(queryParams);

  const dashboardData = useMemo(
    () => unwrapDashboard(dashboardResponse),
    [dashboardResponse],
  );

  // Remember every session we have seen so the dropdown never shrinks
  // after the user narrows the data to one session.
  const seenSessions = useRef(new Set([getCurrentSession()]));

  const analytics = asArray(dashboardData?.internshipAnalytics);
  const sessionOptions = useMemo(() => {
    // If you add `availableSessions` to the API, it is used automatically.
    asArray(dashboardData?.availableSessions).forEach((s) =>
      seenSessions.current.add(s),
    );
    getSessionsFromAnalytics(analytics).forEach((s) =>
      seenSessions.current.add(s),
    );
    if (session !== ALL_SESSIONS) seenSessions.current.add(session);
    return buildSessionOptions([...seenSessions.current]);
  }, [dashboardData, analytics, session]);

  const coverageLabel = useMemo(() => getCoverageLabel(analytics), [analytics]);

  const handleRefetch = useCallback(() => refetch(), [refetch]);
  const goToNOCs = useCallback(() => navigate(ROUTES.nocs), [navigate]);
  const goToOrganisations = useCallback(
    () => navigate(ROUTES.organisations),
    [navigate],
  );
  const handleQuickAction = useCallback(
    (id) => ROUTES.quickActions[id] && navigate(ROUTES.quickActions[id]),
    [navigate],
  );
  const handleViewNOC = useCallback(
    (noc) => navigate(`${ROUTES.nocs}/${noc._id}`),
    [navigate],
  );

  if (isPending) return <DashboardSkeleton />;

  if (isError && !dashboardData) {
    return (
      <StateCard
        tone="error"
        icon={AlertTriangle}
        title="Unable to load dashboard"
        message={getErrorMessage(error)}
        actionLabel={isFetching ? "Retrying…" : "Try again"}
        actionDisabled={isFetching}
        onAction={handleRefetch}
      />
    );
  }

  if (!dashboardData) {
    return (
      <StateCard
        title="No dashboard data yet"
        message="The server returned an empty response. Refresh to try again."
        actionLabel={isFetching ? "Refreshing…" : "Refresh"}
        actionDisabled={isFetching}
        onAction={handleRefetch}
      />
    );
  }

  const overview = dashboardData.overview ?? EMPTY_OBJECT;
  const departmentOverview = asArray(dashboardData.departmentOverview);
  const pendingNOCs = asArray(dashboardData.pendingNOCs);
  const recentActivities = asArray(dashboardData.recentActivities);

  const activeSession =
    dashboardData.filters?.academicSession ||
    (session !== ALL_SESSIONS ? session : null);
  const sessionLabel = `Academic session ${formatSession(activeSession || getCurrentSession())}`;

  return (
    <Reveal
      as="main"
      variants={pageAnimation}
      className="min-h-full min-w-0 bg-cream p-4 sm:p-6 lg:p-8"
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6">
        <DashboardHeader
          session={session}
          onSessionChange={setSession}
          sessionOptions={sessionOptions}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          coverageLabel={coverageLabel}
        />

        {isError && (
          <div
            role="alert"
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>
              Couldn’t refresh the dashboard. Showing the last loaded data.
            </span>
            <button
              type="button"
              onClick={handleRefetch}
              disabled={isFetching}
              className="font-medium underline underline-offset-2 hover:no-underline disabled:opacity-60"
            >
              Retry
            </button>
          </div>
        )}

        <WelcomeBanner
          sessionLabel={sessionLabel}
          onManageNOCs={goToNOCs}
          onViewOrganisations={goToOrganisations}
        />

        <section
          aria-labelledby="platform-overview-heading"
          className="space-y-4"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h2
                id="platform-overview-heading"
                className="text-base font-semibold text-ink"
              >
                Platform overview
              </h2>
              <p className="mt-1 text-xs text-ink-muted">
                Key administrative statistics
              </p>
            </div>
            <span
              aria-live="polite"
              className="min-w-18 shrink-0 text-right text-xs text-ink-muted"
            >
              {isFetching ? "Updating…" : ""}
            </span>
          </div>

          <OverviewStats overview={overview} />
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          <GridCell className="xl:col-span-2">
            <InternshipAnalytics data={analytics} />
          </GridCell>
          <GridCell>
            <DepartmentOverview data={departmentOverview} />
          </GridCell>
        </section>

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-3">
          <GridCell className="xl:col-span-2">
            <PendingNOCs
              data={pendingNOCs}
              onViewAll={goToNOCs}
              onViewNOC={handleViewNOC}
            />
          </GridCell>
          <GridCell>
            <RecentActivities data={recentActivities} />
          </GridCell>
        </section>

        <Reveal as="section" variants={sectionAnimation}>
          <QuickActions onAction={handleQuickAction} />
        </Reveal>

        <footer className="border-t border-border pt-4">
          <p className="text-center text-xs text-ink-muted">
            JGEC Internship Management Portal · Administration
          </p>
        </footer>
      </div>
    </Reveal>
  );
};

export default AdminDashboard;
