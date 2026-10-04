import { CalendarDays, MapPin } from "lucide-react";
import { Card, Input, Select } from "../../../../Components/index";

const InternshipDetailsStep = ({ register, errors, watch }) => {
  const startDate = watch("tentativeStartDate");

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
      value: "fulltime",
    },
    {
      label: "Others",
      value: "others",
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
          <Input
            label="Tentative Internship Location"
            placeholder="e.g. Bengaluru, Karnataka"
            required
            startIcon={<MapPin size={16} strokeWidth={1.8} />}
            error={errors.tentativeWorkLocations?.message}
            {...register("tentativeWorkLocations", {
              required: "Work location is required.",
              validate: (value) =>
                value?.trim() ? true : "Work location is required.",
            })}
          />

          <Input
            label="Tentative Start date"
            type="date"
            required
            startIcon={<CalendarDays size={16} strokeWidth={1.8} />}
            error={errors.tentativeStartDate?.message}
            {...register("tentativeStartDate", {
              required: "Start date is required.",
            })}
          />

          <Input
            label="Tentative End date"
            type="date"
            required
            startIcon={<CalendarDays size={16} strokeWidth={1.8} />}
            error={errors.tentativeEndDate?.message}
            {...register("tentativeEndDate", {
              required: "End date is required.",
              validate: (value) => {
                if (!startDate || !value) {
                  return true;
                }

                return (
                  value >= startDate || "End date must be after the start date."
                );
              },
            })}
          />

          {/* Internship Type */}
          <Select
            label="Internship type"
            required
            options={internshipTypeOptions}
            error={errors.internshipType?.message}
            {...register("internshipType", {
              required: "Please select the internship type.",
            })}
          />

          {/* Internship Mode */}
          <div className="sm:col-span-2">
            <Select
              label="Mode of internship"
              required
              options={modeOptions}
              error={errors.modeOfInternship?.message}
              {...register("modeOfInternship", {
                required: "Please select the internship mode.",
              })}
            />
          </div>

          {/* Additional Information */}
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
              {...register("description")}
            />

            {errors.description?.message && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
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
