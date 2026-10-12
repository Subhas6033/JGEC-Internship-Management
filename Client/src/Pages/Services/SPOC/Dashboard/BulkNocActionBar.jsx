import React from "react";
import { FileCheck, Loader2 } from "lucide-react";

const BulkNocActionBar = ({ selectedCount, loading, onClear, onGenerate }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-bold text-emerald-900">
          {selectedCount} application{selectedCount === 1 ? "" : "s"} selected
        </p>
        <p className="mt-1 text-xs text-emerald-700">
          Bulk NOCs will be grouped by organisation and department.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={loading}
          className="rounded-lg border border-emerald-300 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear Selection
        </button>

        <button
          type="button"
          onClick={onGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <FileCheck size={15} />
          )}
          {loading ? "Generating NOCs..." : "Generate Bulk NOCs"}
        </button>
      </div>
    </div>
  );
};

export default BulkNocActionBar;
