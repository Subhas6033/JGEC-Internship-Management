import { useState } from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Monitor,
  Smartphone,
  LogOut,
  AlertTriangle,
} from "lucide-react";

import { Card, Input, Button } from "../../../../Components/index";

const SecuritySettings = ({ loginActivity, onRevokeSession }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setPasswordData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (passwordData.newPassword.length < 8) {
      setError("New password must contain at least 8 characters.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    // Connect this action to your password-change API.
    setError("Connect the password-change API to complete this operation.");
  };

  const activeSessions = loginActivity.filter(
    (session) =>
      session.status === "Current" || session.status === "Successful",
  );

  return (
    <div className="space-y-5">
      {/* Change Password */}
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-6 flex items-start gap-3">
          <div className="rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <LockKeyhole size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">Change Password</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Use a strong password to protect your administrator account.
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            inputType="password"
            value={passwordData.currentPassword}
            onChange={(e) => handleChange("currentPassword", e.target.value)}
            required
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="New Password"
              inputType="password"
              value={passwordData.newPassword}
              onChange={(e) => handleChange("newPassword", e.target.value)}
              required
            />

            <Input
              label="Confirm New Password"
              inputType="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
              {error}
            </p>
          )}

          <div className="flex justify-end border-t border-border pt-4">
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Card>

      {/* Login Sessions */}
      <Card className="border border-border bg-white p-5 shadow-card sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-brand-600/10 p-3 text-brand-600">
            <ShieldCheck size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-ink">Active Sessions</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Review devices that have accessed your account.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session._id}
              className="flex flex-col gap-3 rounded-xl border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-lg bg-cream-soft p-2.5 text-ink-muted">
                  {session.device.toLowerCase().includes("android") ? (
                    <Smartphone size={20} />
                  ) : (
                    <Monitor size={20} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {session.device}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">
                    {session.location}
                  </p>

                  <p className="mt-1 text-xs text-ink-muted">{session.date}</p>

                  {session.status === "Current" && (
                    <span className="mt-2 inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                      Current Session
                    </span>
                  )}
                </div>
              </div>

              {session.status !== "Current" && (
                <Button
                  size="sm"
                  variant="outline"
                  color="danger"
                  onClick={() => onRevokeSession(session)}
                  className="shrink-0"
                >
                  <LogOut size={15} className="mr-2" />
                  Revoke
                </Button>
              )}
            </div>
          ))}

          {activeSessions.length === 0 && (
            <p className="py-5 text-center text-sm text-ink-muted">
              No active sessions found.
            </p>
          )}
        </div>

        <div className="mt-5 flex gap-2 rounded-xl bg-amber-50 p-3 text-amber-800">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <p className="text-xs leading-5">
            If you notice an unfamiliar device, revoke its session and change
            your password. Session revocation must be connected to the server to
            invalidate real authentication tokens.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SecuritySettings;
