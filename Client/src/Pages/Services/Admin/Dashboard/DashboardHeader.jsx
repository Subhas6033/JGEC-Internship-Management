import { Select } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import { heroContainer, heroItem } from "../../../../Animations/animations";
import { ALL_SESSIONS, DATE_RANGES, getSessionSpan } from "./dashboard.utils";

const pick = (fn) => (e) => fn(e?.target?.value ?? e);

const DashboardHeader = ({
  session = ALL_SESSIONS,
  onSessionChange,
  sessionOptions = [],
  dateRange = "12-months",
  onDateRangeChange,
  coverageLabel = null,
}) => {
  const sessionActive = session !== ALL_SESSIONS;

  return (
    <Reveal
      variants={heroContainer}
      className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
    >
      <Item variants={heroItem} className="min-w-0">
        <div className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
          <span>Administration</span>
          <span aria-hidden="true">/</span>
          <span className="text-brand-700">Dashboard</span>
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Monitor and manage internship activities across JGEC.
        </p>

        <p className="mt-1 text-xs text-ink-muted" aria-live="polite">
          {coverageLabel
            ? `Data available: ${coverageLabel}`
            : "No application data in this period"}
        </p>
      </Item>

      <Item variants={heroItem} className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-44">
          <Select
            options={sessionOptions}
            value={session}
            onChange={pick(onSessionChange)}
            aria-label="Academic session"
            className="hover:cursor-pointer"
          />
        </div>

        <div className="w-full sm:w-44">
          {sessionActive ? (
            <p
              className="flex h-10 items-center justify-center rounded-lg border border-border bg-cream-soft/60 px-3 text-xs text-ink-muted"
              title="The session covers a fixed July–June window"
            >
              {getSessionSpan(session)}
            </p>
          ) : (
            <Select
              options={DATE_RANGES}
              value={dateRange}
              onChange={pick(onDateRangeChange)}
              aria-label="Date range"
              className="hover:cursor-pointer"
            />
          )}
        </div>
      </Item>
    </Reveal>
  );
};

export default DashboardHeader;
