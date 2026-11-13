import { Card } from "../../../../Components/index";

const NOCStatCard = ({ title, value, description, icon: Icon }) => {
  return (
    <Card className="border-border bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-muted">{title}</p>

          <h3 className="mt-2 text-2xl font-semibold text-ink">{value}</h3>

          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        </div>

        <div className="rounded-xl bg-cream-soft p-3 text-brand-600">
          <Icon size={21} />
        </div>
      </div>
    </Card>
  );
};

export default NOCStatCard;
