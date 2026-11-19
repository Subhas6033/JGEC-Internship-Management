import { Building2 } from "lucide-react";

const EmptyApplications = () => (
  <div className="rounded-xl border border-border bg-surface p-12 text-center shadow-[--shadow-card]">
    <Building2 className="mx-auto h-10 w-10 text-ink-muted" />

    <h2 className="mt-3 text-lg font-semibold text-ink">
      No applications found
    </h2>

    <p className="mt-1 text-sm text-ink-muted">
      There are no applications matching your search.
    </p>
  </div>
);

export default EmptyApplications;
