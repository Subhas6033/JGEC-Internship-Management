import { ClipboardCheck, Info } from "lucide-react";

const DashboardHeader = () => (
  <header className="mb-7">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
          SPOC Portal
        </p>

        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Internship Applications
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Review applications approved by the TPO, make decisions, and generate
          NOCs for accepted students.
        </p>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
        <ClipboardCheck size={16} />
        Application Review
      </div>
    </div>

    <div className="mt-5 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

      <div>
        <p className="text-sm font-semibold text-slate-800">
          How to use this dashboard
        </p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
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
