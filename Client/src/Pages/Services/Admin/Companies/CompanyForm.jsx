import { useState } from "react";
import { Input, Button } from "../../../../Components/index";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Map stored schema fields → form state. Only these fields are ever sent.
const toFormState = (org) => ({
  organisationName: org?.organisationName ?? "",
  organisationSite: org?.organisationSite ?? "",
  organisationLocation: org?.organisationLocation ?? "",
  organisationMail: org?.organisationMail ?? "",
});

const isValidSite = (value) => {
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    return url.hostname.includes(".");
  } catch {
    return false;
  }
};

const CompanyForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  serverError = "",
}) => {
  const [formData, setFormData] = useState(() => toFormState(initialData));
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    const {
      organisationName,
      organisationSite,
      organisationLocation,
      organisationMail,
    } = formData;

    if (!organisationName.trim())
      next.organisationName = "Organisation name is required.";

    if (!organisationSite.trim())
      next.organisationSite = "Website is required.";
    else if (!isValidSite(organisationSite.trim()))
      next.organisationSite =
        "Enter a valid website, e.g. https://www.example.com.";

    if (!organisationLocation.trim())
      next.organisationLocation = "Location is required.";

    if (!organisationMail.trim()) next.organisationMail = "Email is required.";
    else if (!EMAIL_RE.test(organisationMail.trim()))
      next.organisationMail = "Enter a valid email address.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    const site = formData.organisationSite.trim();

    onSubmit({
      organisationName: formData.organisationName.trim(),
      organisationSite: /^https?:\/\//i.test(site) ? site : `https://${site}`,
      organisationLocation: formData.organisationLocation.trim(),
      organisationMail: formData.organisationMail.trim().toLowerCase(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {serverError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Organisation name"
            name="organisationName"
            value={formData.organisationName}
            onChange={handleChange}
            placeholder="e.g. Indian Institute of Technology Madras"
            error={errors.organisationName}
            required
            animate={false}
          />
        </div>

        <Input
          label="Organisation email"
          name="organisationMail"
          type="email"
          value={formData.organisationMail}
          onChange={handleChange}
          placeholder="contact@example.com"
          error={errors.organisationMail}
          required
          animate={false}
        />

        <Input
          label="Location"
          name="organisationLocation"
          value={formData.organisationLocation}
          onChange={handleChange}
          placeholder="City, State"
          error={errors.organisationLocation}
          required
          animate={false}
        />

        <div className="sm:col-span-2">
          <Input
            label="Website"
            name="organisationSite"
            value={formData.organisationSite}
            onChange={handleChange}
            placeholder="https://www.example.com"
            error={errors.organisationSite}
            required
            animate={false}
          />
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-border pt-4 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving…"
            : initialData
              ? "Save changes"
              : "Add organisation"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
