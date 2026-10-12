import React from "react";
import { Loader2 } from "lucide-react";

const DashboardLoading = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-700" />
      <p className="text-sm font-medium text-slate-600">
        Loading applications...
      </p>
    </div>
  </div>
);

export default DashboardLoading;
