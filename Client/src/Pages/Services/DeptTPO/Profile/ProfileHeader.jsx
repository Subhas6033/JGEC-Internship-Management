import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

const ProfileHeader = ({ profile }) => {
  if (!profile) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="h-28 bg-brand-700 sm:h-32" />

      <div className="px-5 pb-6 sm:px-7">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-cream-dark text-2xl font-semibold text-ink shadow-card sm:size-28 sm:text-3xl">
              {profile.initials}
            </div>

            <div className="pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                  {profile.name}
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <ShieldCheck size={13} />
                  {profile.accountStatus}
                </span>
              </div>

              <p className="mt-1 text-sm text-ink-muted">
                {profile.designation}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-2.5 text-ink-muted">
            <Mail size={16} className="shrink-0 text-brand-700" />
            <span className="truncate">{profile.email}</span>
          </div>

          <div className="flex items-center gap-2.5 text-ink-muted">
            <Phone size={16} className="shrink-0 text-brand-700" />
            <span>{profile.mobile}</span>
          </div>

          <div className="flex items-center gap-2.5 text-ink-muted">
            <MapPin size={16} className="shrink-0 text-brand-700" />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;