import { ArrowLeft, Clock3, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Card, Input } from "../../Components/index";

const DeptTPOForgotPassword = () => {
  return (
    <main className="min-h-screen bg-cream px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-2xl border border-border bg-white shadow-card lg:grid-cols-[1fr_1.05fr]">
          <section className="hidden bg-brand-700 p-8 text-white lg:flex lg:flex-col lg:justify-between xl:p-10">
            <div>
              <div className="flex size-11 items-center justify-center rounded-full bg-white">
                <img src="/jgecLogo.png" alt="college logo" />
              </div>

              <p className="mt-8 text-xs font-medium uppercase tracking-[0.16em] text-white/70">
                Internship Management Portal
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-tight">
                Department TPO Portal
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
                Secure account recovery for registered Department TPO
                coordinators.
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-5">
              <p className="text-xs leading-5 text-white/65">
                Password recovery will be connected to the portal backend
                during the development process.
              </p>
            </div>
          </section>

          <section className="flex items-center p-5 sm:p-8 xl:p-10">
            <Card className="w-full border-0 p-0 shadow-none">
              <div className="mx-auto w-full max-w-md">
                <Link
                  to="/auth/depttpo/login"
                  className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition hover:text-brand-700"
                >
                  <ArrowLeft size={16} strokeWidth={1.8} />
                  Back to sign in
                </Link>

                <div className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Clock3 size={23} strokeWidth={1.8} />
                </div>

                <p className="eyebrow mt-6">Account recovery</p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                  Forgot your password?
                </h2>

                <p className="mt-2 text-sm leading-6 text-ink-muted">
                  Enter your college email and we’ll use it to start the
                  password recovery process once the feature is available.
                </p>

                <div className="mt-7 rounded-xl border border-brand-200 bg-brand-50 p-4">
                  <div className="flex gap-3">
                    <Clock3
                      className="mt-0.5 shrink-0 text-brand-700"
                      size={18}
                      strokeWidth={1.8}
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-900">
                        Coming Soon
                      </p>
                      <p className="mt-1 text-xs leading-5 text-brand-800">
                        Password reset and email verification are currently
                        under development.
                      </p>
                    </div>
                  </div>
                </div>

                <form className="mt-7 space-y-5" onSubmit={(event) => event.preventDefault()}>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      College email
                    </label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@college.edu"
                      autoComplete="email"
                      disabled
                      startIcon={<Mail size={17} strokeWidth={1.8} />}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled
                    className="w-full justify-center"
                  >
                    Send reset link
                  </Button>
                </form>

                <p className="mt-6 text-center text-xs leading-5 text-ink-muted">
                  This page is ready for backend integration in a future
                  development phase.
                </p>
              </div>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
};

export default DeptTPOForgotPassword;
