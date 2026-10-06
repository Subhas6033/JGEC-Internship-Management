import { Building2, ShieldCheck, CalendarDays } from "lucide-react";
import { Card } from "../../../../Components";
import { SectionHeader } from "./SectionHeader";
import { getDisplayValue, formatDate } from "./displayValue";
import SPOCProfileCard from "../../../../Components/SPOC/SPOCProfileCard";

export const OrganizationInformation = ({ spoc }) => {
  return (
    <Card className="h-full w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          icon={Building2}
          title="Organization"
          description="Institution and department information"
        />

        <div className="mt-5 space-y-3">
          <SPOCProfileCard
            label="Department"
            value={getDisplayValue(spoc?.department)}
            icon={Building2}
          />

          <SPOCProfileCard
            label="Role"
            value={getDisplayValue(spoc?.role)}
            icon={ShieldCheck}
          />

          <SPOCProfileCard
            label="Account Created"
            value={formatDate(spoc?.createdAt)}
            icon={CalendarDays}
          />
        </div>
      </Card.Content>
    </Card>
  );
};
