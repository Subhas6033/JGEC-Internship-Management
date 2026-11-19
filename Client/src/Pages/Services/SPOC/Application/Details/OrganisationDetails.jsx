import { Building2, MapPin, Mail, Phone } from "lucide-react";
import { DetailsCard, DetailItem } from "./DetailComponents";

export default function OrganisationDetails({ organisation }) {
  return (
    <DetailsCard
      icon={<Building2 size={20} />}
      title="Organisation Details"
      description="Information about the internship organisation."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <DetailItem
          icon={<Building2 size={16} />}
          label="Organisation Name"
          value={organisation.name}
        />
        <DetailItem
          icon={<MapPin size={16} />}
          label="Location"
          value={organisation.location}
        />
        <DetailItem
          icon={<Mail size={16} />}
          label="Contact Email"
          value={organisation.email}
        />
        <DetailItem
          icon={<Phone size={16} />}
          label="Contact Phone"
          value={organisation.phone}
        />
      </div>
    </DetailsCard>
  );
}
