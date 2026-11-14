import { useEffect, useState } from "react";
import { Camera, UserRound, Mail, Phone } from "lucide-react";

import { Card, Input, Button } from "../../../../Components/index";

const ProfileSettings = ({ profile, onSave }) => {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="space-y-5">
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-ink">
            Personal Information
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Manage your administrator profile details.
          </p>
        </div>

        {/* Profile Avatar */}
        <div className="mb-7 flex flex-wrap items-center gap-4">
          <div className="flex size-20 items-center justify-center rounded-full bg-brand-600/10 text-brand-700">
            <UserRound size={34} />
          </div>

          <div>
            <p className="font-semibold text-ink">{formData.name}</p>
            <p className="mt-1 text-sm text-ink-muted">
              {formData.designation}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
              Administrator
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              startIcon={<UserRound size={17} />}
              required
            />

            <Input
              label="Email Address"
              inputType="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              startIcon={<Mail size={17} />}
              required
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              startIcon={<Phone size={17} />}
            />

            <Input
              label="Designation"
              value={formData.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
            />

            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => handleChange("department", e.target.value)}
              disabled
            />

            <Input label="Employee ID" value={formData.employeeId} disabled />
          </div>

          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit">Save Profile Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSettings;
