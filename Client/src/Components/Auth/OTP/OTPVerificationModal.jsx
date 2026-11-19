import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { Modal, Button } from "../../index";

const OTP_LENGTH = 6;
const DEFAULT_RESEND_DELAY = 30;

/** a***e@example.com — enough to recognise the address, not enough to leak it. */
const maskEmail = (email) => {
  if (!email || !email.includes("@")) return "";
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0] ?? ""}***@${domain}`;
  return `${local[0]}${"*".repeat(Math.min(local.length - 2, 5))}${local.slice(-1)}@${domain}`;
};

/**
 * Seconds left until `deadline`. Based on timestamps instead of decrementing a
 * counter, so the value stays correct when the tab is throttled in the background.
 */
const secondsUntil = (deadline) =>
  Math.max(0, Math.ceil((deadline - Date.now()) / 1000));

const OTPVerificationModal = ({
  open,
  email,
  role,
  onClose,
  onVerify,
  onResend,
  isVerifying = false,
  isResending = false,
  error = "",
  resendDelay = DEFAULT_RESEND_DELAY,
}) => {
  const [otp, setOtp] = useState("");
  const [localError, setLocalError] = useState("");
  const [focused, setFocused] = useState(false);
  const [resendDeadline, setResendDeadline] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(resendDelay);

  const inputRef = useRef(null);

  const startCooldown = useCallback(() => {
    const deadline = Date.now() + resendDelay * 1000;
    setResendDeadline(deadline);
    setSecondsLeft(resendDelay);
  }, [resendDelay]);

  // Fresh state every time the modal opens.
  useEffect(() => {
    if (!open) return;
    setOtp("");
    setLocalError("");
    startCooldown();
  }, [open, startCooldown]);

  // Tick once per second while a cooldown is running.
  useEffect(() => {
    if (!open || !resendDeadline) return;

    const tick = () => setSecondsLeft(secondsUntil(resendDeadline));
    tick();

    const id = setInterval(() => {
      tick();
      if (Date.now() >= resendDeadline) clearInterval(id);
    }, 1000);

    return () => clearInterval(id);
  }, [open, resendDeadline]);

  const busy = isVerifying || isResending;
  const complete = otp.length === OTP_LENGTH;
  const message = localError || error;
  const canResend = secondsLeft === 0 && !busy;
  const maskedEmail = maskEmail(email);

  const handleChange = (event) => {
    setOtp(event.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH));
    setLocalError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;

    if (!complete) {
      setLocalError(`Enter all ${OTP_LENGTH} digits of the code.`);
      inputRef.current?.focus();
      return;
    }

    try {
      await onVerify(otp);
    } catch {
      // The parent surfaces the failure through the `error` prop.
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    setLocalError("");

    try {
      await onResend();
      setOtp("");
      startCooldown();
      inputRef.current?.focus();
    } catch {
      // The parent surfaces the failure through the `error` prop.
    }
  };

  const activeIndex = Math.min(otp.length, OTP_LENGTH - 1);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Enter verification code"
      description={
        maskedEmail
          ? `We sent a ${OTP_LENGTH}-digit code to ${maskedEmail}.`
          : `We sent a ${OTP_LENGTH}-digit code to your registered email.`
      }
      size="sm"
      closeOnBackdrop={!isVerifying}
      closeOnEscape={!isVerifying}
      showCloseButton={!isVerifying}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label
            htmlFor="login-otp"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Verification code
          </label>

          {/*
            One real input sits on top of six display cells. This keeps native
            behaviour (paste, SMS autofill, password managers, screen readers)
            without managing focus across six separate fields.
          */}
          <div className="relative">
            <div className="grid grid-cols-6 gap-2" aria-hidden="true">
              {Array.from({ length: OTP_LENGTH }, (_, index) => {
                const isActive = focused && index === activeIndex && !busy;
                return (
                  <div
                    key={index}
                    className={[
                      "flex h-12 items-center justify-center rounded-md border bg-white text-lg font-semibold tabular-nums text-gray-900 transition-colors",
                      message
                        ? "border-red-400"
                        : isActive
                          ? "border-blue-600 ring-2 ring-blue-600/20"
                          : "border-gray-300",
                      busy ? "bg-gray-50 text-gray-400" : "",
                    ].join(" ")}
                  >
                    {otp[index] ?? ""}
                  </div>
                );
              })}
            </div>

            <input
              ref={inputRef}
              id="login-otp"
              name="otp"
              type="text"
              value={otp}
              onChange={handleChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              autoFocus
              disabled={isVerifying}
              aria-invalid={Boolean(message)}
              aria-describedby={message ? "login-otp-error" : undefined}
              className="absolute inset-0 h-full w-full cursor-text opacity-0"
            />
          </div>

          <p
            id="login-otp-error"
            role="alert"
            className={message ? "mt-2 text-sm text-red-600" : "sr-only"}
          >
            {message}
          </p>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={!complete || busy}
          className="w-full"
        >
          {isVerifying ? (
            <>
              <LoaderCircle
                size={18}
                className="animate-spin"
                aria-hidden="true"
              />
              Verifying
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {role ? (
              <>
                Signing in as <span className="capitalize">{role}</span>
              </>
            ) : null}
          </span>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend}
            className="rounded font-medium text-blue-600 hover:text-blue-700 focus-visible:outline-2  focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:text-gray-400"
          >
            {isResending
              ? "Sending…"
              : secondsLeft > 0
                ? `Resend code in ${secondsLeft}s`
                : "Resend code"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export { OTPVerificationModal };
