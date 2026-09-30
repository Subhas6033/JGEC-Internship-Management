import { Building2, Globe2, Mail, Phone, UserRound } from "lucide-react";
import { Card, Input } from "../../../../Components/index";

const CompanyDetailsStep = ({ register, errors }) => {
  return (
    <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
      <Card.Header className="border-b border-border px-5 py-5 sm:px-6">
        <Card.Title className="text-base font-semibold text-ink sm:text-lg">
          Company details
        </Card.Title>

        <Card.Description className="mt-1.5 leading-5 text-ink-muted">
          Tell us about the organisation where you will complete your
          internship.
        </Card.Description>
      </Card.Header>

      <Card.Content className="px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 m-2">
          <Input
            label="Company name"
            placeholder="e.g. Microsoft"
            required
            startIcon={<Building2 size={16} strokeWidth={1.8} />}
            error={errors.companyName?.message}
            {...register("companyName", {
              required: "Company name is required.",
              minLength: {
                value: 2,
                message: "Enter a valid company name.",
              },
            })}
          />

          <Input
            label="Internship role"
            placeholder="e.g. Software Engineering Intern"
            required
            error={errors.internshipRole?.message}
            {...register("internshipRole", {
              required: "Internship role is required.",
            })}
          />

          <div className="sm:col-span-2">
            <Input
              label="Company website"
              type="url"
              placeholder="https://company.com"
              startIcon={<Globe2 size={16} strokeWidth={1.8} />}
              error={errors.companyWebsite?.message}
              {...register("companyWebsite", {
                pattern: {
                  value: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i,
                  message: "Enter a valid website URL.",
                },
              })}
            />
          </div>

          <Input
            label="Apply to "
            placeholder="e.g. Priya Menon"
            required
            startIcon={<UserRound size={16} strokeWidth={1.8} />}
            error={errors.supervisorName?.message}
            {...register("supervisorName", {
              required: "Supervisor name is required.",
            })}
          />

          <Input
            label="application email"
            type="email"
            placeholder="name@company.com"
            required
            startIcon={<Mail size={16} strokeWidth={1.8} />}
            error={errors.supervisorEmail?.message}
            {...register("supervisorEmail", {
              required: "Supervisor email is required.",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address.",
              },
            })}
          />

          <Input
            label="Company contact number"
            type="tel"
            placeholder="10 digit mobile number"
            startIcon={<Phone size={16} strokeWidth={1.8} />}
            error={errors.companyPhone?.message}
            {...register("companyPhone", {
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: "Enter a valid 10-digit number.",
              },
            })}
          />

          <Input
            label="Company location"
            placeholder="e.g. Bengaluru, Karnataka"
            required
            error={errors.companyLocation?.message}
            {...register("companyLocation", {
              required: "Company location is required.",
            })}
          />

          <div className="sm:col-span-2">
            <Input
              label="Company address"
              placeholder="Office / campus address"
              error={errors.companyAddress?.message}
              {...register("companyAddress")}
            />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CompanyDetailsStep;
