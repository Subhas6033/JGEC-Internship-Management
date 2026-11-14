import { CalendarDays, Download } from "lucide-react";

import { Button, Select } from "../../../../Components/index";

const AnalyticsFilters = ({ period, onPeriodChange, onExport }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-2">
        <CalendarDays size={17} className="shrink-0 text-ink-muted" />

        <div className="w-full sm:w-48">
          <Select
            value={period}
            onChange={onPeriodChange}
            options={[
              { label: "Last 30 Days", value: "30d" },
              { label: "Last 90 Days", value: "90d" },
              { label: "Last 12 Months", value: "12m" },
            ]}
          />
        </div>
      </div>

      <Button variant="outline" onClick={onExport} className="w-full sm:w-auto">
        <Download size={16} className="mr-2" />
        Export Report
      </Button>
    </div>
  );
};

export default AnalyticsFilters;
