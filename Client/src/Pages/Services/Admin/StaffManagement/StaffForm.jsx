import { Button, Input, Select } from "../../../../Components/index";
import { departmentOptions } from "./adminStaff.data";

const roleOptions = [
  { label: "Training and Placement Officer (TPO)", value: "TPO" },
  { label: "Student Placement Officer Coordinator (SPOC)", value: "SPOC" },
];

const StaffForm = ({ form, setForm, onSubmit, onCancel, editing }) => {
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
          label="Full Name"
          placeholder="Enter staff name"
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
          required
        />

        <Input
          label="Employee ID"
          placeholder="Enter employee ID"
          value={form.employeeId}
          onChange={(e) => updateField("employeeId", e.target.value)}
          required
        />

        <Input
          label="Official Email"
          type="email"
          placeholder="name@jgec.ac.in"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          required
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          required
        />

        <Select
          label="Role"
          value={form.role}
          onChange={(value) => updateField("role", value)}
          options={roleOptions}
          required
        />

        <Select
          label="Department"
          value={form.department}
          onChange={(value) =>
            updateField("department", value?.target?.value ?? value)
          }
          options={departmentOptions}
          placeholder="Select department"
          required
        />
      </div>

      <div className="rounded-lg bg-cream-soft/70 p-3">
        <p className="text-xs leading-5 text-ink-muted">
          Staff account credentials and login access should be handled through
          your authentication system. Do not store passwords in this form.
        </p>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">{editing ? "Save Changes" : "Add Staff"}</Button>
      </div>
    </form>
  );
};

export default StaffForm;
