import React from "react";
import { Search, Plus, X } from "lucide-react";
import { Button, Input, Select } from "../../../../Components/index";
import { industryOptions, statusOptions } from "./companies.data";

const CompanyToolbar = ({
  search,
  setSearch,
  industry,
  setIndustry,
  status,
  setStatus,
  onAddCompany,
}) => {
  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setStatus("all");
  };

  const hasFilters = search || industry || status !== "all";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="w-full flex-1">
          <Input
            placeholder="Search organisation name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            startIcon={<Search size={18} />}
            animate={false}
            containerClassName="w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-95">
          <Select
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            placeholder="All Industries"
            options={industryOptions}
          />

          <Select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            options={statusOptions}
          />
        </div>

        <Button onClick={onAddCompany} className="shrink-0">
          <Plus size={18} />
          Add Organisation
        </Button>
      </div>

      {hasFilters && (
        <div>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            <X size={15} />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyToolbar;
