import React from "react";
import { X } from "lucide-react";

const BulkNocResult = ({ result, onDismiss }) => {
  if (!result) return null;

  return (
    <div className="mb-6 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900">
            Bulk NOC Generation Completed
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            NOCs were generated according to organisation and department groups.
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss bulk NOC result"
          className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X size={20} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {(result.groups || []).map((group, index) => (
          <div
            key={`${group?.referenceNumber || "bulk-group"}-${index}`}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {typeof group?.organisation === "object"
                    ? group?.organisation?.name || "Organisation"
                    : group?.organisation || "Organisation"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Department: {group?.department || "N/A"}
                </p>

                <p className="mt-1 text-xs font-semibold text-emerald-700">
                  Reference: {group?.referenceNumber || "N/A"}
                </p>
              </div>

              <div className="text-xs font-medium text-slate-500">
                {group?.applicationIds?.length || 0} application
                {(group?.applicationIds?.length || 0) === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        ))}
      </div>

      {result.skipped?.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800">
            {result.skipped.length} application
            {result.skipped.length === 1 ? "" : "s"} skipped
          </p>
          <p className="mt-1 text-xs leading-5 text-amber-700">
            Some applications could not receive an NOC and were returned by the
            backend.
          </p>
        </div>
      )}
    </div>
  );
};

export default BulkNocResult;
