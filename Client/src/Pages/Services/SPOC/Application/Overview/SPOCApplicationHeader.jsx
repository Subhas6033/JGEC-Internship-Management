const SPOCApplicationHeader = ({ total }) => {
  return (
    <section className="w-full min-w-0">
      <p className="eyebrow">SPOC Applications</p>

      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-tight tracking-tight text-ink sm:text-3xl">
            Applications
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
            Review company-wise internship applications forwarded by the
            Department TPO.
          </p>
        </div>

        <div className="shrink-0 rounded-lg bg-brand-50 px-3 py-2">
          <p className="text-xs text-brand-700">Total Applications</p>
          <p className="mt-0.5 text-lg font-bold text-brand-900">{total}</p>
        </div>
      </div>
    </section>
  );
};

export default SPOCApplicationHeader;
