import { BriefcaseBusiness, CalendarDays, MapPin } from "lucide-react";
import { DetailsCard, PeriodRow, DetailItem } from "./DetailComponents";

export default function InternshipDetails({ internship }) {
  return (
    <DetailsCard
      icon={<BriefcaseBusiness size={20} />}
      title="Internship Details"
      description="Proposed internship role, duration, and location."
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailItem label="Designation" value={internship.designation} />
        <DetailItem label="Duration" value={internship.duration} />
        <PeriodRow
          icon={<CalendarDays size={17} />}
          label="Tentative Start Date"
          value={internship.startDate}
        />
        <PeriodRow
          icon={<CalendarDays size={17} />}
          label="Tentative End Date"
          value={internship.endDate}
        />
        <div className="sm:col-span-2">
          <PeriodRow
            icon={<MapPin size={17} />}
            label="Work Location"
            value={internship.workLocation}
          />
        </div>
      </div>
    </DetailsCard>
  );
}
