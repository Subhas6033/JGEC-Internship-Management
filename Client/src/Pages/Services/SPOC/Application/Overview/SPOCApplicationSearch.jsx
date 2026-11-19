import { Search, SlidersHorizontal } from "lucide-react";
import { Card, Input } from "../../../../../Components/index";

const SPOCApplicationSearch = ({ search, setSearch, activeStatus }) => {
  const statusLabel = (activeStatus || "all").replaceAll("_", " ");

  return (
    <Card className="w-full min-w-0 border-border bg-surface shadow-sm">
      <Card.Content className="p-4! sm:p-5!">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          {/* Search Input */}
          <div className="min-w-0 flex-1">
            <Input
              id="application-search"
              label="Search applications"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search company, student, roll number or application ID..."
              startIcon={<Search size={18} />}
              containerClassName="w-full"
              className="bg-cream-soft border-border"
            />
          </div>

          {/* Active Status */}
          <div className="flex h-12 shrink-0 items-center">
            <div className="inline-flex h-10 items-center gap-2 rounded-xl bg-cream px-4 text-sm font-medium capitalize text-ink-muted">
              <SlidersHorizontal size={16} />
              <span className="whitespace-nowrap">
                {statusLabel} applications
              </span>
            </div>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default SPOCApplicationSearch;
