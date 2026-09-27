import { RotateCcw, Search } from "lucide-react";

import { Button, Input, Select } from "../../../../Components";

const NotificationFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  onReset,
}) => {
  const categoryOptions = [
    {
      value: "all",
      label: "All categories",
    },
    {
      value: "application",
      label: "Applications",
    },
    {
      value: "verification",
      label: "Verification",
    },
    {
      value: "document",
      label: "Documents",
    },
    {
      value: "internship",
      label: "Internships",
    },
  ];

  const statusOptions = [
    {
      value: "all",
      label: "All notifications",
    },
    {
      value: "unread",
      label: "Unread",
    },
    {
      value: "read",
      label: "Read",
    },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto]">
      <div className="relative">
        <Search
          size={17}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notifications..."
          className="pl-10"
        />
      </div>

      <Select
        value={category}
        onChange={(event) => setCategory(event.target.value)}
        options={categoryOptions}
        placeholder="Category"
      />

      <Select
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        options={statusOptions}
        placeholder="Status"
      />

      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap"
      >
        <RotateCcw size={15} />
        <span>Reset</span>
      </Button>
    </div>
  );
};

export default NotificationFilters;
