import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Button, Input } from "../../../../Components/index";

const emptyValues = {
  organisationName: "",
  organisationLocation: "",
  organisationMail: "",
  organisationSite: "",
};

const validate = (v) => {
  const errors = {};
  if (!v.organisationName.trim())
    errors.organisationName = "Enter the organisation name.";
  if (!v.organisationLocation.trim())
    errors.organisationLocation = "Enter the city or location.";
  if (!/^\S+@\S+\.\S+$/.test(v.organisationMail.trim()))
    errors.organisationMail = "Enter a valid email address.";
  if (
    v.organisationSite.trim() &&
    !/^https?:\/\/\S+\.\S+/i.test(v.organisationSite.trim())
  )
    errors.organisationSite = "Enter a full URL, like https://example.com.";
  return errors;
};

const OrganisationForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const isEdit = Boolean(initialValues);

  const [values, setValues] = useState({
    organisationName: initialValues?.organisationName ?? "",
    organisationLocation: initialValues?.organisationLocation ?? "",
    organisationMail: initialValues?.organisationMail ?? "",
    organisationSite: initialValues?.organisationSite ?? "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    await onSubmit({
      organisationName: values.organisationName.trim(),
      organisationLocation: values.organisationLocation.trim(),
      organisationMail: values.organisationMail.trim(),
      organisationSite: values.organisationSite.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Organisation name"
          name="organisationName"
          required
          value={values.organisationName}
          onChange={handleChange}
          error={errors.organisationName}
          placeholder="e.g. Infosys"
          containerClassName="sm:col-span-2"
        />

        <Input
          label="Location"
          name="organisationLocation"
          required
          value={values.organisationLocation}
          onChange={handleChange}
          error={errors.organisationLocation}
          placeholder="City, State"
        />

        <Input
          label="Email"
          name="organisationMail"
          type="email"
          required
          value={values.organisationMail}
          onChange={handleChange}
          error={errors.organisationMail}
          placeholder="hr@example.com"
        />

        <Input
          label="Website"
          name="organisationSite"
          type="url"
          value={values.organisationSite}
          onChange={handleChange}
          error={errors.organisationSite}
          placeholder="https://example.com"
          containerClassName="sm:col-span-2"
        />
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
          {submitting
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Add organisation"}
        </Button>
      </div>
    </form>
  );
};

export default OrganisationForm;
