import { Card } from "../../../../Components";

const getInitials = (fullName = "") => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

// Read-only identity card shown at the top of the settings page.
const ProfileSummary = ({ profile }) => (
  <Card className="p-5">
    <div className="flex items-center gap-4">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-700 text-lg font-semibold text-white">
        {getInitials(profile?.fullName)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="truncate text-lg font-semibold text-ink">
            {profile?.fullName || "Department TPO"}
          </p>

          {profile?.role && (
            <span className="rounded-full border border-border bg-cream-dark px-2.5 py-0.5 text-xs font-medium text-ink">
              {profile.role}
            </span>
          )}
        </div>

        <p className="mt-0.5 truncate text-sm text-ink-muted">
          {profile?.email}
        </p>
      </div>
    </div>
  </Card>
);

export default ProfileSummary;
