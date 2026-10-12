import React from "react";
import { AlertCircle } from "lucide-react";

const DashboardError = ({ message }) => (
  <div className="mx-auto max-w-7xl">
    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
      <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

      <h2 className="mt-3 text-lg font-semibold text-red-800">
        Unable to load applications
      </h2>

      <p className="mt-2 text-sm text-red-600">
        {message || "Something went wrong while loading applications."}
      </p>
    </div>
  </div>
);

export default DashboardError;
