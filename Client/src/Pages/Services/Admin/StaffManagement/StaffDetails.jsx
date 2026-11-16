import {
  UserRound,
  Mail,
  Phone,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  IdCard,
} from "lucide-react";
import { Button } from "../../../../Components/index";
import StaffStatus from "./StaffStatus";

const DetailItem = ({ icon: Icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-lg bg-cream-soft p-2 text-brand-600">
        <Icon size={18} />
      </div>

      <div className="min-w-0">
        <p className="text-xs text-ink-muted">{label}</p>

        <p className="mt-1 wrap-break-word text-sm font-medium text-ink">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

const StaffDetails = ({ staff, onClose }) => {
  if (!staff) return null;

  return (
    <div className="space-y-5">
      {/* Profile */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cream-soft text-brand-600">
            <UserRound size={23} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-ink">{staff.name}</h2>

            <p className="mt-1 text-sm text-ink-muted">{staff.role}</p>
          </div>
        </div>

        <StaffStatus status={staff.status} />
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border p-4 sm:grid-cols-2">
        <DetailItem
          icon={IdCard}
          label="Employee ID"
          value={staff.employeeId}
        />

        <DetailItem
          icon={BriefcaseBusiness}
          label="Designation"
          value={staff.role}
        />

        <DetailItem icon={Mail} label="Official Email" value={staff.email} />

        <DetailItem icon={Phone} label="Phone Number" value={staff.phone} />

        <DetailItem
          icon={Building2}
          label="Department"
          value={staff.department}
        />

        <DetailItem
          icon={CalendarDays}
          label="Joined On"
          value={staff.joinedAt}
        />
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default StaffDetails;
