import { Building2, CalendarPlus, MapPin, Clock3 } from "lucide-react";
import { Card } from "../../../../Components/index";
import { Reveal, Item } from "./MotionBlocks";
import {
  staggerFast,
  fadeUp,
  hoverLiftSmall,
} from "../../../../Animations/animations";
import { formatDate } from "./organisations.utils";

// `stats` comes from the API, so the numbers cover every organisation,
// not just the page currently on screen.
const CompanyStats = ({ stats = null, loading = false }) => {
  const now = new Date();
  const latest = stats?.latest;

  const cards = [
    {
      title: "Total organisations",
      value: stats?.total ?? 0,
      note: "Registered in the portal",
      icon: Building2,
      color: "bg-brand-50 text-brand-700",
    },
    {
      title: "Added this month",
      value: stats?.addedThisMonth ?? 0,
      note: now.toLocaleString("en-IN", { month: "long", year: "numeric" }),
      icon: CalendarPlus,
      color: "bg-green-50 text-green-700",
    },
    {
      title: "Locations",
      value: stats?.locations ?? 0,
      note: "Unique cities / regions",
      icon: MapPin,
      color: "bg-indigo-50 text-indigo-700",
    },
    {
      title: "Last registered",
      value: latest
        ? formatDate(latest.createdAt, { day: "2-digit", month: "short" })
        : "—",
      note: latest?.organisationName || "No organisations yet",
      icon: Clock3,
      color: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <Reveal
      variants={staggerFast}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map(({ title, value, note, icon: Icon, color }) => (
        <Item
          key={title}
          variants={fadeUp}
          whileHover={hoverLiftSmall}
          className="min-w-0"
        >
          <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-muted">{title}</p>
                  {loading ? (
                    <div
                      aria-hidden="true"
                      className="mt-3 h-8 w-16 animate-pulse rounded-md bg-brand-100 motion-reduce:animate-none"
                    />
                  ) : (
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                      {value}
                    </h3>
                  )}
                </div>

                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${color}`}
                >
                  <Icon size={21} strokeWidth={1.8} aria-hidden="true" />
                </div>
              </div>

              <p
                className="mt-4 truncate text-xs text-ink-muted"
                title={typeof note === "string" ? note : undefined}
              >
                {loading ? "Loading…" : note}
              </p>
            </div>
          </Card>
        </Item>
      ))}
    </Reveal>
  );
};

export default CompanyStats;
