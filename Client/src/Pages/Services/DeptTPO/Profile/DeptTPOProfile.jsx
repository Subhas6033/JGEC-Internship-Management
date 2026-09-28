import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Edit3,
  GraduationCap,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Button, Card } from "../../../../Components";

import ProfileHeader from "./ProfileHeader";
import { deptTPOProfile, profileStats } from "./profile.data";

const DeptTPOProfile = () => {
  const handleEditProfile = () => {
    console.log("Edit Dept TPO profile");
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-auto space-y-6">
        {/* Page heading */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="eyebrow">Department TPO</span>

            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Coordinator Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted">
              View and manage your Department TPO coordinator information.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={handleEditProfile}
            className="w-full sm:w-auto"
          >
            <Edit3 size={16} />
            Edit profile
          </Button>
        </div>

        {/* Profile hero */}
        <ProfileHeader profile={deptTPOProfile} />

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {profileStats.map((stat) => (
            <Card key={stat.label} className="p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {stat.label}
              </p>

              <p className="mt-2 text-2xl font-semibold text-ink">
                {stat.value}
              </p>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Personal information */}
          <Card className="p-5 sm:p-6 lg:col-span-2">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <UserRound size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-ink">
                  Personal information
                </h2>

                <p className="mt-0.5 text-xs text-ink-muted">
                  Your coordinator account details
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <ProfileField
                icon={UserRound}
                label="Full name"
                value={deptTPOProfile.name}
              />

              <ProfileField
                icon={IdCard}
                label="Employee ID"
                value={deptTPOProfile.employeeId}
              />

              <ProfileField
                icon={Mail}
                label="College email"
                value={deptTPOProfile.email}
              />

              <ProfileField
                icon={Phone}
                label="Mobile number"
                value={deptTPOProfile.mobile}
              />

              <ProfileField
                icon={CalendarDays}
                label="Joined date"
                value={deptTPOProfile.joinedDate}
              />

              <ProfileField
                icon={ShieldCheck}
                label="Account status"
                value={deptTPOProfile.accountStatus}
                valueClassName="text-emerald-700"
              />
            </div>
          </Card>

          {/* Department information */}
          <Card className="p-5 sm:p-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Building2 size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-ink">Department</h2>

                <p className="mt-0.5 text-xs text-ink-muted">
                  Assigned department details
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-5">
              <ProfileField
                icon={Building2}
                label="Department"
                value={deptTPOProfile.department}
              />

              <ProfileField
                icon={GraduationCap}
                label="College"
                value={deptTPOProfile.college}
              />

              <ProfileField
                icon={MapPin}
                label="Location"
                value={deptTPOProfile.location}
              />
            </div>
          </Card>
        </div>

        {/* Coordinator responsibility */}
        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 size={18} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-ink">
                  Coordinator access
                </h2>

                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Your account is authorized to manage internship applications
                  for the {deptTPOProfile.department} department.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 size={14} />
              Active coordinator
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AccessItem label="Review applications" />
            <AccessItem label="Set deadlines" />
            <AccessItem label="Approve applications" />
            <AccessItem label="Forward to central TPO" />
          </div>
        </Card>
      </div>
    </section>
  );
};

const ProfileField = ({
  icon: Icon,
  label,
  value,
  valueClassName = "text-ink",
}) => (
  <div className="min-w-0">
    <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
    </div>

    <p
      className={`mt-1.5 wrap-break-word text-sm font-medium ${valueClassName}`}
    >
      {value}
    </p>
  </div>
);

const AccessItem = ({ label }) => (
  <div className="flex items-center gap-2.5 rounded-lg border border-border bg-cream-soft px-3.5 py-3">
    <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />

    <span className="text-sm text-ink">{label}</span>
  </div>
);

export default DeptTPOProfile;
