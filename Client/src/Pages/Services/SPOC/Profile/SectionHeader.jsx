export const SectionHeader = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
        <Icon size={16} />
      </span>

      <div className="min-w-0">
        <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>

        <p className="text-xs text-ink-muted">{description}</p>
      </div>
    </div>
  );
};
