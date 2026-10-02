import { Building2, Globe2, Mail, UserRound } from "lucide-react";
import { Card, Input, Select } from "../../../../Components/index";

const CompanyDetailsStep = ({
  register,
  errors,
  organisations = [],
  selectedOrganisation,
}) => {
  const organisationOptions = organisations.map((organisation) => ({
    label: organisation.organisationName,
    value: organisation._id,
  }));

  return (
    <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
      <Card.Header className="border-b border-border px-5 py-5 sm:px-6">
        <Card.Title className="text-base font-semibold text-ink sm:text-lg">
          Company details
        </Card.Title>

        <Card.Description className="mt-1.5 leading-5 text-ink-muted">
          Select the organisation where you will complete your internship.
        </Card.Description>
      </Card.Header>

      <Card.Content className="px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 m-2">
          {/* Organisation */}
          <div className="sm:col-span-2">
            <Select
              label="Organisation"
              required
              options={organisationOptions}
              error={errors.organisation?.message}
              startIcon={<Building2 size={16} strokeWidth={1.8} />}
              {...register("organisation", {
                required: "Please select an organisation.",
              })}
            />
          </div>

          {/* Organisation website - backend controlled */}
          <ReadOnlyField
            label="Organisation website"
            value={selectedOrganisation?.organisationSite}
            icon={<Globe2 size={16} strokeWidth={1.8} />}
          />

          {/* Organisation email - backend controlled */}
          <ReadOnlyField
            label="Organisation email"
            value={selectedOrganisation?.organisationMail}
            icon={<Mail size={16} strokeWidth={1.8} />}
          />

          {/* Organisation location - backend controlled */}
          <div className="sm:col-span-2">
            <ReadOnlyField
              label="Organisation location"
              value={selectedOrganisation?.organisationLocation}
              icon={<Building2 size={16} strokeWidth={1.8} />}
            />
          </div>

          {/* Employee/contact person - student enters */}
          <Input
            label="Apply to"
            placeholder="e.g. Priya Menon"
            required
            startIcon={<UserRound size={16} strokeWidth={1.8} />}
            error={errors.organisationsEmployye?.message}
            {...register("organisationsEmployye", {
              required: "Please provide the person you are applying to.",
            })}
          />

          {/* Designation - student enters */}
          <Input
            label="Internship role"
            placeholder="e.g. Software Engineering Intern"
            required
            error={errors.designation?.message}
            {...register("designation", {
              required: "Internship role is required.",
            })}
          />
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-cream px-3.5 py-3">
          <Building2 size={15} className="mt-0.5 shrink-0 text-ink-muted" />

          <p className="text-xs leading-5 text-ink-muted">
            Organisation information is fetched directly from the portal. You
            cannot modify the organisation website, location or email.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

const ReadOnlyField = ({ label, value, icon }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>

      <div
        className="
          flex min-h-10 w-full items-center gap-2
          rounded-md border border-border
          bg-cream px-3 py-2
          text-sm text-ink
        "
      >
        <span className="shrink-0 text-ink-muted">{icon}</span>

        <span className="truncate">{value || "Select an organisation"}</span>
      </div>
    </div>
  );
};

export default CompanyDetailsStep;
