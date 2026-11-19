import {
  UserRound,
  ShieldCheck,
  SlidersHorizontal,
  Monitor,
  History,
} from "lucide-react";
import { Button } from "../../../../Components/index";
const iconMap = {
  UserRound,
  History,
  ShieldCheck,
  SlidersHorizontal,
  Monitor,
};

const SettingsSidebar = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-border pb-3 lg:flex-col lg:overflow-visible lg:border-b-0 lg:pb-0">
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        const active = activeTab === tab.id;
        const disabled = Boolean(tab.comingSoon);

        return (
          <Button
            key={tab.id}
            type="button"
            disabled={disabled}
            aria-disabled={disabled}
            onClick={() => !disabled && onTabChange(tab?.id)}
            className={`
  flex shrink-0 items-center gap-3 rounded-xl px-4 py-3
  text-sm font-medium transition-all duration-200
  ${
    disabled
      ? "bg-transparent! text-ink-muted/50! cursor-not-allowed"
      : active
        ? "bg-brand-600! text-white! shadow-sm hover:bg-brand-700!"
        : "bg-brand-50! text-brand-700! border border-brand-100 hover:bg-brand-100! hover:text-brand-800!"
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
          </Button>
        );
      })}
    </nav>
  );
};

export default SettingsSidebar;
