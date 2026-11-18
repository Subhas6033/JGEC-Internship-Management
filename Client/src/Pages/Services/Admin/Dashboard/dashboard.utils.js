export const DATE_RANGES = [
  { label: "Last 30 days", value: "30-days" },
  { label: "Last 90 days", value: "90-days" },
  { label: "Last 12 months", value: "12-months" },
];

export const ALL_SESSIONS = "rolling";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Academic years run July → June (matches the backend). */
const startYearOf = (year, monthIndex) => (monthIndex >= 6 ? year : year - 1);

export const getCurrentSession = (date = new Date()) => {
  const start = startYearOf(date.getFullYear(), date.getMonth());
  return `${start}-${start + 1}`;
};

export const formatSession = (value) => (value ? value.replace("-", "–") : "");

/** "2026-2027" → "Jul 2026 – Jun 2027" */
export const getSessionSpan = (value) => {
  const [start, end] = String(value).split("-");
  return start && end ? `Jul ${start} – Jun ${end}` : "";
};

const toPoint = (item) => {
  const monthIndex = MONTHS.indexOf(item?.month);
  const year = Number(item?.year);
  return monthIndex === -1 || !Number.isFinite(year)
    ? null
    : { year, monthIndex };
};

/** Sessions that actually contain data points in the analytics array. */
export const getSessionsFromAnalytics = (analytics = []) => {
  const sessions = new Set();
  for (const item of analytics) {
    const point = toPoint(item);
    if (!point) continue;
    const start = startYearOf(point.year, point.monthIndex);
    sessions.add(`${start}-${start + 1}`);
  }
  return [...sessions];
};

/** "Nov 2026" or "Nov 2025 – Nov 2026", taken from the data that came back. */
export const getCoverageLabel = (analytics = []) => {
  const points = analytics.map(toPoint).filter(Boolean);
  if (points.length === 0) return null;

  const key = (p) => p.year * 12 + p.monthIndex;
  const sorted = [...points].sort((a, b) => key(a) - key(b));
  const fmt = (p) => `${MONTHS[p.monthIndex]} ${p.year}`;
  const first = fmt(sorted[0]);
  const last = fmt(sorted[sorted.length - 1]);

  return first === last ? first : `${first} – ${last}`;
};

/** Newest first. Merges everything the app has seen so options never vanish. */
export const buildSessionOptions = (sessions) => {
  const unique = [...new Set(sessions.filter(Boolean))].sort().reverse();
  return [
    { label: "All sessions", value: ALL_SESSIONS },
    ...unique.map((value) => ({ label: formatSession(value), value })),
  ];
};
