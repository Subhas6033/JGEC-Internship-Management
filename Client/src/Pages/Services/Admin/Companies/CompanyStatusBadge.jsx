import React from "react";

const styles = {
  Active: "bg-green-50 text-green-700 ring-green-600/20",
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Inactive: "bg-gray-100 text-gray-600 ring-gray-500/20",
};

const CompanyStatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
        styles[status] || styles.Inactive
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Active"
            ? "bg-green-500"
            : status === "Pending"
              ? "bg-amber-500"
              : "bg-gray-400"
        }`}
      />

      {status}
    </span>
  );
};

export default CompanyStatusBadge;
