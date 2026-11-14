import { Card } from "../../../../Components";

// Card with an icon, title and description. Wrap any settings block in this.
const SettingsSection = ({ icon: Icon, title, description, children }) => (
  <Card className="p-5">
    <div className="flex items-start gap-3">
      {Icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-dark text-ink-muted">
          <Icon size={17} />
        </span>
      )}

      <div className="min-w-0">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-ink-muted">{description}</p>
        )}
      </div>
    </div>

    <div className="mt-5">{children}</div>
  </Card>
);

export default SettingsSection;
