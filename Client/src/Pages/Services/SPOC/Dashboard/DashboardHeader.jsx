import { ClipboardCheck, Info } from "lucide-react";

const DashboardHeader = () => (
  <header className="mb-7">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="eyebrow">SPOC Portal</p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink md:text-3xl">
          Internship Applications
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
          Review applications approved by the TPO, make decisions, and generate
          NOCs for accepted students.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-xs font-semibold text-brand-800">
        <ClipboardCheck size={16} />
        Application Review
      </div>
    </div>

    <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" />

      <div>
        <p className="text-sm font-semibold text-ink">How to use this dashboard</p>
        <p className="mt-1 text-xs leading-5 text-ink-muted">
          Expand an organisation to review its applications. Accept suitable
          applications, reject unsuitable ones, or send applications back when
          corrections are needed. Once accepted, select students to generate
          their NOCs.
        </p>
      </div>
    </div>
  </header>
);

export default DashboardHeader;
