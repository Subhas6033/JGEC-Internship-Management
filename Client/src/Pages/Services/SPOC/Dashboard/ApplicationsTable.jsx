import React from "react";
import ApplicationRow from "./ApplicationRow";
import { getApplicationId } from "./spocDashboard.utils";

const ApplicationsTable = ({
  applications,
  selectedIds,
  actionLoading,
  bulkLoading,
  onToggleSelection,
  onView,
  onDecision,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-275">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50/80">
          {[
            "Select",
            "Student",
            "Roll No.",
            "Department",
            "Internship",
            "Dates",
            "Status",
            "Actions",
          ].map((heading) => (
            <th
              key={heading}
              className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                heading === "Student"
                  ? "px-5 text-left"
                  : heading === "Actions"
                    ? "px-5 text-right"
                    : heading === "Select"
                      ? "w-12 text-center"
                      : "text-left"
              }`}
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {applications.map((application) => {
          const id = getApplicationId(application);

          return (
            <ApplicationRow
              key={id}
              application={application}
              selected={selectedIds.includes(id)}
              actionLoading={actionLoading}
              bulkLoading={bulkLoading}
              onToggleSelection={onToggleSelection}
              onView={onView}
              onDecision={onDecision}
            />
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ApplicationsTable;
