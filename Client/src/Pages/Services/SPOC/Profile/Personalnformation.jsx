import { UserRound, ShieldCheck, Mail, Phone } from "lucide-react";
import { Card } from "../../../../Components";
import { SectionHeader } from "./SectionHeader";
import SPOCProfileCard from "../../../../Components/SPOC/SPOCProfileCard";
import { getDisplayValue } from "./displayValue";

export const PersonalInformation = ({ spoc }) => {
  return (
    <Card className="h-full w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          icon={UserRound}
          title="Personal Information"
          description="Your registered SPOC details"
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SPOCProfileCard
            label="Full Name"
            value={getDisplayValue(spoc?.fullName)}
            icon={UserRound}
          />

          <SPOCProfileCard
            label="SPOC ID"
            value={getDisplayValue(spoc?.spocId)}
            icon={ShieldCheck}
          />

          <SPOCProfileCard
            label="Email Address"
            value={getDisplayValue(spoc?.email)}
            icon={Mail}
          />

          <SPOCProfileCard
            label="Mobile Number"
            value={getDisplayValue(spoc?.mobile)}
            icon={Phone}
          />
        </div>
      </Card.Content>
    </Card>
  );
};
