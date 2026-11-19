import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, KeyRound, LockKeyhole } from "lucide-react";
import { Button, Card, Input } from "../../../../Components";
import { logout } from "../../../../Store/Slice/authSlice";
import { useChangeSpocPassword } from "../../../../Services/Queries/spocProfile.quires";
import { SectionHeader } from "../Profile/SectionHeader";

const VisibilityToggle = ({ visible, onToggle, label }) => (
  <button
    type="button"
    onClick={onToggle}
    className="pointer-events-auto rounded p-1 text-ink-muted transition-colors hover:text-brand-700"
    aria-label={visible ? `Hide ${label}` : `Show ${label}`}
  >
    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
  </button>
);

const PasswordSettings = ({ onNotify }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const changePassword = useChangeSpocPassword();

  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const toggle = (key) =>
    setShow((value) => ({ ...value, [key]: !value[key] }));

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");

  const onSubmit = async (data) => {
    try {
      await changePassword.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      reset();

      // The server ended every session, so sign out locally and go to login.
      navigate("/auth/spoc/login", {
        replace: true,
        state: {
          message: "Password changed successfully. Please sign in again.",
        },
      });
      dispatch(logout());
      queryClient.clear();
    } catch (error) {
      onNotify(
        "error",
        "Unable to change password",
        error?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <Card className="w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          icon={KeyRound}
          title="Change password"
          description="You will be signed out on all devices after changing it"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 space-y-5"
        >
          <Input
            label="Current password"
            type={show.current ? "text" : "password"}
            placeholder="Enter your current password"
            autoComplete="current-password"
            required
            startIcon={<LockKeyhole size={16} strokeWidth={1.8} />}
            endIcon={
              <VisibilityToggle
                visible={show.current}
                onToggle={() => toggle("current")}
                label="current password"
              />
            }
            error={errors.currentPassword?.message}
            {...register("currentPassword", {
              required: "Current password is required",
            })}
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="New password"
              type={show.next ? "text" : "password"}
              placeholder="8-20 characters"
              autoComplete="new-password"
              required
              startIcon={<LockKeyhole size={16} strokeWidth={1.8} />}
              endIcon={
                <VisibilityToggle
                  visible={show.next}
                  onToggle={() => toggle("next")}
                  label="new password"
                />
              }
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password must be at most 20 characters",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).+$/,
                  message: "Use at least one letter and one number",
                },
                validate: (value) =>
                  value !== currentPassword ||
                  "New password must differ from the current password",
              })}
            />

            <Input
              label="Confirm new password"
              type={show.confirm ? "text" : "password"}
              placeholder="Re-enter new password"
              autoComplete="new-password"
              required
              startIcon={<LockKeyhole size={16} strokeWidth={1.8} />}
              endIcon={
                <VisibilityToggle
                  visible={show.confirm}
                  onToggle={() => toggle("confirm")}
                  label="confirm password"
                />
              }
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
            />
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={changePassword.isPending}
              className="w-full bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-700 sm:w-auto"
            >
              <KeyRound size={16} strokeWidth={1.9} />
              {changePassword.isPending ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default PasswordSettings;
