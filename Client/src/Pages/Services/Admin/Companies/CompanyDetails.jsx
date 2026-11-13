import React from "react";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  CalendarDays,
} from "lucide-react";

import CompanyStatusBadge from "./CompanyStatusBadge";

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 items-start gap-3">
    <div className="rounded-lg bg-gray-100 p-2 text-gray-600">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-gray-900">
        {value || "Not provided"}
      </p>
    </div>
  </div>
);

const CompanyDetails = ({ company }) => {
  if (!company) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Building2 size={28} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="wrap-break-word text-lg font-semibold text-gray-900">
            {company.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {company.shortName} · {company.industry}
          </p>
        </div>

        <CompanyStatusBadge status={company.status} />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <DetailItem icon={Mail} label="Email" value={company.email} />

        <DetailItem icon={Phone} label="Phone" value={company.phone} />

        <DetailItem icon={MapPin} label="Location" value={company.location} />

        <DetailItem icon={Globe} label="Website" value={company.website} />

        <DetailItem
          icon={CalendarDays}
          label="Registered On"
          value={company.createdAt}
        />
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-sm font-semibold text-gray-900">About Company</h4>

        <p className="mt-2 text-sm leading-6 text-gray-600">
          {company.description || "No description available."}
        </p>
      </div>
    </div>
  );
};

export default CompanyDetails;
