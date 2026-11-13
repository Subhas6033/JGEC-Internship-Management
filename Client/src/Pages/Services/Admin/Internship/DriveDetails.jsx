import {
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Users,
} from "lucide-react";

import { Button } from "../../../../Components/index";
import DriveStatus from "./DriveStatus";

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-cream-soft p-2 text-brand-600">
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xs text-ink-muted">{label}</p>

        <p className="mt-1 text-sm font-medium text-ink">{value || "—"}</p>
      </div>
    </div>
  );
};

const DriveDetails = ({ drive, onClose }) => {
  if (!drive) return null;

  return (
    <div className="space-y-5">
      <div>
        <DriveStatus status={drive.status} />

        <h2 className="mt-3 text-xl font-semibold text-ink">{drive.title}</h2>

        <p className="mt-1 text-sm text-ink-muted">{drive.company}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DetailItem icon={Building2} label="Company" value={drive.company} />

        <DetailItem
          icon={BriefcaseBusiness}
          label="Location"
          value={drive.location}
        />

        <DetailItem
          icon={CalendarDays}
          label="Application Deadline"
          value={drive.deadline}
        />

        <DetailItem
          icon={CalendarDays}
          label="Internship Start Date"
          value={drive.startDate}
        />

        <DetailItem
          icon={Users}
          label="Applications"
          value={drive.applications}
        />
      </div>

      <div className="border-t border-border pt-4">
        <p className="text-sm font-medium text-ink">Description</p>

        <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">
          {drive.description || "No description provided."}
        </p>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default DriveDetails;
