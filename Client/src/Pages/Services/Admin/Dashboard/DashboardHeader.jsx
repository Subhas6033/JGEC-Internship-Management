import { CalendarDays, Download, Plus } from "lucide-react";
import { Button, Select } from "../../../../Components/index";

const DashboardHeader = () => {
  return (
    <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
      <div>
        <div className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
          <span>Administration</span>
          <span>/</span>
          <span className="text-brand-700">Dashboard</span>
        </div>

        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-ink-muted">
          Monitor and manage internship activities across JGEC.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="w-full sm:w-48">
          <Select
            options={[
              { label: "2025–2026", value: "2025-2026" },
              { label: "2026–2027", value: "2026-2027" },
            ]}
            defaultValue="2026-2027"
            aria-label="Academic session"
          />
        </div>

        <Button variant="outline" size="md">
          <CalendarDays size={16} />
          <span>Last 12 months</span>
        </Button>

        <Button variant="outline" size="md">
          <Download size={16} />
          <span>Export</span>
        </Button>

        <Button size="md">
          <Plus size={17} />
          <span>Quick Add</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
