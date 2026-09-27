import { CalendarDays, MapPin } from "lucide-react";
import { Card, Input, Select } from "../../../../Components/index";

const InternshipDetailsStep = ({ register, errors, watch }) => {
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const internshipTypeOptions = [
    {
      label: "Summer Internship",
      value: "summer",
    },
    {
      label: "Winter Internship",
      value: "winter",
    },
    {
      label: "Semester Internship",
      value: "semester",
    },
    {
      label: "Full-time Internship",
      value: "full-time",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  const modeOptions = [
    {
      label: "On-site",
      value: "onsite",
    },
    {
      label: "Hybrid",
      value: "hybrid",
    },
    {
      label: "Remote",
      value: "remote",
    },
  ];

  return (
    <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
      <Card.Header className="border-b border-border px-5 py-5 sm:px-6">
        <Card.Title className="text-base font-semibold text-ink sm:text-lg">
          Internship details
        </Card.Title>

        <Card.Description className="mt-1.5 leading-5 text-ink-muted">
          Provide the internship period, work location and mode.
        </Card.Description>
      </Card.Header>

      <Card.Content className="px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 m-2">
          <Select
            label="Internship type"
            required
            options={internshipTypeOptions}
            error={errors.internshipType?.message}
            {...register("internshipType", {
              required: "Please select the internship type.",
            })}
          />

          <Input
            label="Work location"
            placeholder="e.g. Bengaluru, Karnataka"
            required
            startIcon={<MapPin size={16} strokeWidth={1.8} />}
            error={errors.workLocation?.message}
            {...register("workLocation", {
              required: "Work location is required.",
            })}
          />

          <Input
            label="Start date"
            type="date"
            required
            startIcon={<CalendarDays size={16} strokeWidth={1.8} />}
            error={errors.startDate?.message}
            {...register("startDate", {
              required: "Start date is required.",
            })}
          />

          <Input
            label="End date"
            type="date"
            required
            startIcon={<CalendarDays size={16} strokeWidth={1.8} />}
            error={errors.endDate?.message}
            {...register("endDate", {
              required: "End date is required.",
              validate: (value) => {
                if (!startDate || !value) return true;

                return (
                  value >= startDate || "End date must be after the start date."
                );
              },
            })}
          />

          <div className="sm:col-span-2">
            <Select
              label="Mode of internship"
              required
              options={modeOptions}
              error={errors.mode?.message}
              {...register("mode", {
                required: "Please select the internship mode.",
              })}
            />
          </div>

          <div className="sm:col-span-2">
            <Input
              label="Work location / office address"
              placeholder="Where will you physically work?"
              startIcon={<MapPin size={16} strokeWidth={1.8} />}
              error={errors.officeAddress?.message}
              {...register("officeAddress")}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-ink">
              Additional information
            </label>

            <textarea
              rows={4}
              placeholder="Add any additional information about your internship..."
              className="
                block w-full resize-none
                rounded-md border border-border
                bg-cream-soft
                px-3 py-2.5
                text-sm text-ink
                placeholder:text-ink-muted
                outline-none
                transition-[border-color,box-shadow]
                duration-150
                focus:border-brand-600
                focus:ring-2
                focus:ring-brand-600/15
              "
              {...register("additionalInformation")}
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-border bg-cream px-4 py-3">
          <p className="text-xs font-semibold text-ink">Before continuing</p>

          <p className="mt-1 text-xs leading-5 text-ink-muted">
            Make sure the internship dates and work location match the
            information provided by your company.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

export default InternshipDetailsStep;
