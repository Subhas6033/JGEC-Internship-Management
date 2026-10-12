import React from "react";
import { Building2 } from "lucide-react";

const EmptyApplications = () => (
  <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
    <Building2 className="mx-auto h-10 w-10 text-slate-300" />

    <h2 className="mt-3 text-lg font-semibold text-slate-800">
      No applications found
    </h2>

    <p className="mt-1 text-sm text-slate-500">
      There are no applications matching your search.
    </p>
  </div>
);

export default EmptyApplications;
