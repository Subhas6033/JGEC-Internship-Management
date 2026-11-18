import {
  Building2,
  Mail,
  MapPin,
  Globe,
  CalendarDays,
  RefreshCw,
} from "lucide-react";
import {
  formatDateTime,
  getHostname,
  toAbsoluteUrl,
} from "./organisations.utils";

const DetailItem = ({ icon: Icon, label, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <div className="rounded-lg bg-cream-soft p-2 text-ink-muted">
      <Icon size={17} aria-hidden="true" />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <div className="mt-1 wrap-break-word text-sm font-medium text-ink">
        {children || "Not provided"}
      </div>
    </div>
  </div>
);

const link = "text-brand-700 hover:underline";

const CompanyDetails = ({ company }) => {
  if (!company) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl bg-cream-soft/60 p-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
          <Building2 size={28} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="wrap-break-word text-lg font-semibold text-ink">
            {company.organisationName}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {company.organisationLocation || "Location not provided"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailItem icon={Mail} label="Email">
          {company.organisationMail && (
            <a href={`mailto:${company.organisationMail}`} className={link}>
              {company.organisationMail}
            </a>
          )}
        </DetailItem>

        <DetailItem icon={Globe} label="Website">
          {company.organisationSite && (
            <a
              href={toAbsoluteUrl(company.organisationSite)}
              target="_blank"
              rel="noopener noreferrer"
              className={link}
            >
              {getHostname(company.organisationSite)}
            </a>
          )}
        </DetailItem>

        <DetailItem icon={MapPin} label="Location">
          {company.organisationLocation}
        </DetailItem>

        <DetailItem icon={CalendarDays} label="Registered on">
          {formatDateTime(company.createdAt)}
        </DetailItem>

        <DetailItem icon={RefreshCw} label="Last updated">
          {formatDateTime(company.updatedAt)}
        </DetailItem>
      </div>
    </div>
  );
};

export default CompanyDetails;
