import { useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { Button } from "../../../../Components";
import FormField from "./Formfield";
import SectionFooter from "./SectionFooter";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_PATTERN = /^\d{10}$/;

const toFormValues = (profile) => ({
  fullName: profile?.fullName ?? "",
  email: profile?.email ?? "",
  mobileNumber: profile?.mobile ?? "",
});

const validate = (values) => {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Enter your full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.mobileNumber.trim()) {
    errors.mobileNumber = "Enter your mobile number.";
  } else if (!MOBILE_PATTERN.test(values.mobileNumber.trim())) {
    errors.mobileNumber = "Enter a 10-digit mobile number.";
  }

  return errors;
};

const ProfileDetailsForm = ({ profile, onSubmit, isSaving = false }) => {
  const [values, setValues] = useState(() => toFormValues(profile));
  const [errors, setErrors] = useState({});

  const saved = toFormValues(profile);
  const isDirty = Object.keys(values).some(
    (field) => values[field].trim() !== saved[field].trim(),
  );

  const setField = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleReset = () => {
    setValues(toFormValues(profile));
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    await onSubmit({
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      mobileNumber: values.mobileNumber.trim(),
      role: profile?.role,
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <FormField
          id="tpo-full-name"
          label="Full name"
          required
          className="sm:col-span-2"
          value={values.fullName}
          onChange={(event) => setField("fullName", event.target.value)}
          error={errors.fullName}
          autoComplete="name"
          placeholder="Your full name"
        />

        <FormField
          id="tpo-email"
          label="Email address"
          required
          type="email"
          value={values.email}
          onChange={(event) => setField("email", event.target.value)}
          error={errors.email}
          hint="Used for portal updates and sign-in."
          autoComplete="email"
          placeholder="name@college.ac.in"
        />

        <FormField
          id="tpo-mobile"
          label="Mobile number"
          required
          prefix="+91"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={values.mobileNumber}
          onChange={(event) =>
            setField("mobileNumber", event.target.value.replace(/\D/g, ""))
          }
          error={errors.mobileNumber}
          hint="10 digits, without the country code."
          autoComplete="tel-national"
          placeholder="98765 43210"
        />
      </div>

      <SectionFooter
        message={isDirty ? "You have unsaved changes." : "No changes to save."}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleReset}
          disabled={!isDirty || isSaving}
        >
          <RotateCcw size={15} />
          Discard
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!isDirty || isSaving}
        >
          <Save size={15} />
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </SectionFooter>
    </form>
  );
};

export default ProfileDetailsForm;
