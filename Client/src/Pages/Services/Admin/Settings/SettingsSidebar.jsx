import {
  UserRound,
  ShieldCheck,
  SlidersHorizontal,
  Monitor,
  History,
} from "lucide-react";

const iconMap = {
  UserRound,
  ShieldCheck,
  SlidersHorizontal,
  Monitor,
  History,
};

const SettingsSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0">
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];

        const active = activeTab === tab.id;
        const disabled = Boolean(tab.comingSoon);

        return (
          <button
            key={tab.id}
            type="button"
            disabled={disabled}
            aria-disabled={disabled}
            onClick={() => !disabled && onTabChange(tab.id)}
            className={`
              flex shrink-0 items-center gap-3 rounded-xl px-4 py-3
              text-sm font-medium transition-colors
              ${
                disabled
                  ? "cursor-not-allowed text-ink-muted/60"
                  : active
                    ? "bg-brand-600/10 text-brand-700"
                    : "text-ink-muted hover:bg-cream-soft hover:text-ink"
              }
            `}
          >
            {Icon && <Icon size={18} />}

            <span className="whitespace-nowrap">{tab.label}</span>

            {disabled && (
              <span className="ml-auto rounded-full bg-cream-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
                Soon
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;
