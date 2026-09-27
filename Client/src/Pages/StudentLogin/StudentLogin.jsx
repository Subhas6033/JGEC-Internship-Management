import { useState } from "react";
import { ArrowRight, Eye, EyeOff, FileSignature, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Input, Select } from "../../Components";

const initialForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  password: "",
  rollNumber: "",
  department: "",
  signature: null,
  gurdianName: "",
  gurdianMobile: "",
};

const departmentOptions = [
  { label: "Computer Science & Engineering", value: "CSE" },
  { label: "Electronics & Communication Engineering", value: "ECE" },
  { label: "Electrical Engineering", value: "EE" },
  { label: "Mechanical Engineering", value: "ME" },
  { label: "Civil Engineering", value: "CE" },
  { label: "Information Technology", value: "IT" },
];

const inputClassName =
  "border-border bg-cream-soft text-ink placeholder:text-ink-muted/60 " +
  "focus:border-brand-600 focus:ring-brand-600/15";

const StudentLogin = () => {
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-cream px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        {/* Intro */}
        <div className="pt-2 lg:sticky lg:top-24">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-cream-soft shadow-sm">
            <img
              src="/jgecLogo.png"
              alt="JGEC"
              className="size-9 object-contain"
            />
          </div>

          <p className="eyebrow mt-7">Student access</p>

          <h1 className="mt-3 max-w-md font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Create your internship portal account.
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-ink-muted sm:text-base">
            Enter your academic and guardian details to set up your student
            profile for the JGEC Internship Management Portal.
          </p>

          <div className="mt-7 space-y-3 text-xs text-ink-muted">
            {[
              "Use your official college email address.",
              "Keep your roll number exactly as issued by JGEC.",
              "Upload a clear image of your signature.",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-ink-muted">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-700 transition-colors hover:text-brand-800"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Student form */}
        <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
          <Card.Header className="border-b border-border px-5 py-5 sm:px-7">
            <Card.Title className="text-xl text-ink">
              Student registration
            </Card.Title>
            <Card.Description className="mt-2 text-ink-muted">
              Complete all required fields to continue.
            </Card.Description>
          </Card.Header>

          <form onSubmit={handleSubmit}>
            <Card.Content className="space-y-7 px-5 py-6 sm:px-7">
              <div>
                <p className="eyebrow">Personal details</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Full name"
                    name="fullName"
                    value={form.fullName}
                    onChange={(event) => updateField("fullName", event.target.value)}
                    placeholder="Your full name"
                    startIcon={<UserRound size={16} />}
                    className={inputClassName}
                    required
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="you@jgec.ac.in"
                    startIcon={<Mail size={16} />}
                    description="Use your official college email."
                    className={inputClassName}
                    required
                  />

                  <Input
                    label="Mobile number"
                    name="mobileNumber"
                    type="tel"
                    inputMode="numeric"
                    value={form.mobileNumber}
                    onChange={(event) => updateField("mobileNumber", event.target.value)}
                    placeholder="+91 98765 43210"
                    startIcon={<Phone size={16} />}
                    className={inputClassName}
                    required
                  />

                  <Input
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(event) => updateField("password", event.target.value)}
                    placeholder="6–20 characters"
                    startIcon={<LockKeyhole size={16} />}
                    endIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="pointer-events-auto rounded p-1 text-ink-muted transition-colors hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-600"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    className={inputClassName}
                    required
                  />
                </div>
              </div>

              <div className="border-t border-border pt-7">
                <p className="eyebrow">Academic details</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Roll number"
                    name="rollNumber"
                    value={form.rollNumber}
                    onChange={(event) => updateField("rollNumber", event.target.value)}
                    placeholder="e.g. 2022CSE001"
                    className={inputClassName}
                    required
                  />

                  <Select
                    label="Department"
                    name="department"
                    value={form.department}
                    onChange={(event) => updateField("department", event.target.value)}
                    options={departmentOptions}
                    placeholder="Select your department"
                    className={inputClassName}
                    required
                  />

                  <div className="sm:col-span-2">
                    <Input
                      label="Signature"
                      name="signature"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        updateField("signature", event.target.files?.[0] ?? null)
                      }
                      startIcon={<FileSignature size={16} />}
                      description="Upload a clear PNG, JPG, or WebP image of your signature."
                      className={inputClassName}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-7">
                <p className="eyebrow">Guardian details</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2">
                  <Input
                    label="Guardian name"
                    name="gurdianName"
                    value={form.gurdianName}
                    onChange={(event) => updateField("gurdianName", event.target.value)}
                    placeholder="Parent / guardian full name"
                    className={inputClassName}
                    required
                  />

                  <Input
                    label="Guardian mobile"
                    name="gurdianMobile"
                    type="tel"
                    inputMode="numeric"
                    value={form.gurdianMobile}
                    onChange={(event) => updateField("gurdianMobile", event.target.value)}
                    placeholder="+91 98765 43210"
                    startIcon={<Phone size={16} />}
                    className={inputClassName}
                    required
                  />
                </div>
              </div>

              {submitted && (
                <div
                  role="status"
                  className="rounded-lg border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800"
                >
                  Your details are ready to be submitted to the internship
                  service.
                </div>
              )}
            </Card.Content>

            <Card.Footer className="flex-col items-stretch gap-3 border-t border-border px-5 py-5 sm:px-7">
              <Button
                type="submit"
                size="lg"
                className="w-full rounded-lg bg-brand-700 text-white shadow-sm hover:bg-brand-800 focus-visible:ring-brand-600"
              >
                <span>Continue to portal</span>
                <ArrowRight size={17} aria-hidden="true" />
              </Button>

              <p className="text-center text-[11px] leading-5 text-ink-muted">
                By continuing, you confirm that the information provided is
                accurate.
              </p>
            </Card.Footer>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default StudentLogin;
