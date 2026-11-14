import { Button, Input, Select } from "../../../../Components/index";
import { driveTypeOptions } from "./adminDrives.data";

const DriveForm = ({ form, setForm, onSubmit, onCancel, editing }) => {
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Internship Title"
          placeholder="Frontend Developer Intern"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />

        <Input
          label="Company Name"
          placeholder="Enter company name"
          value={form.company}
          onChange={(e) => updateField("company", e.target.value)}
          required
        />

        <Input
          label="Location"
          placeholder="Kolkata / Remote"
          value={form.location}
          onChange={(e) => updateField("location", e.target.value)}
          required
        />

        <Select
          label="Internship Type"
          value={form.type}
          onChange={(value) => updateField("type", value)}
          options={driveTypeOptions}
        />

        <Input
          label="Stipend"
          placeholder="₹15,000/month"
          value={form.stipend}
          onChange={(e) => updateField("stipend", e.target.value)}
        />

        <Input
          label="Application Deadline"
          type="date"
          value={form.deadline}
          onChange={(e) => updateField("deadline", e.target.value)}
          required
        />

        <Input
          label="Internship Start Date"
          type="date"
          value={form.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-ink">
          Description
        </label>

        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Enter internship description, eligibility and requirements..."
          className="w-full rounded-lg border border-border bg-cream-soft px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          {editing ? "Save Changes" : "Create Drive"}
        </Button>
      </div>
    </form>
  );
};

export default DriveForm;
