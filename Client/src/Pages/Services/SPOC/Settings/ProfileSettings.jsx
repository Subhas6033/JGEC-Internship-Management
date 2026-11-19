import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Phone, Save, UserRound } from "lucide-react";
import { Button, Card, Input } from "../../../../Components";
import { useUpdateSpocProfile } from "../../../../Services/Queries/spocProfile.quires";
import { SectionHeader } from "../Profile/SectionHeader";

const ProfileSettings = ({ spoc, onNotify }) => {
  const updateProfile = useUpdateSpocProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      fullName: spoc?.fullName ?? "",
      mobile: spoc?.mobile ?? "",
    },
  });

  // Keep the form in sync once the profile loads / is saved
  useEffect(() => {
    reset({
      fullName: spoc?.fullName ?? "",
      mobile: spoc?.mobile ?? "",
    });
  }, [spoc?.fullName, spoc?.mobile, reset]);

  const onSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync({
        fullName: data.fullName.trim(),
        mobile: data.mobile.trim(),
      });

      onNotify("success", "Profile updated", "Your details were saved.");
    } catch (error) {
      onNotify(
        "error",
        "Unable to update profile",
        error?.message || "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <Card className="w-full min-w-0 border-border bg-surface shadow-(--shadow-card)">
      <Card.Content className="p-4 sm:p-5 lg:p-6">
        <SectionHeader
          icon={UserRound}
          title="Profile details"
          description="Your name and contact number appear on generated NOCs"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-5 space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input
              label="Full name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              startIcon={<UserRound size={16} strokeWidth={1.8} />}
              error={errors.fullName?.message}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 2, message: "Enter at least 2 characters" },
                maxLength: {
                  value: 100,
                  message: "Full name cannot exceed 100 characters",
                },
              })}
            />

            <Input
              label="Mobile number"
              type="tel"
              placeholder="10-digit mobile number"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={10}
              required
              startIcon={<Phone size={16} strokeWidth={1.8} />}
              error={errors.mobile?.message}
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="md"
              disabled={!isDirty || updateProfile.isPending}
              onClick={() =>
                reset({
                  fullName: spoc?.fullName ?? "",
                  mobile: spoc?.mobile ?? "",
                })
              }
            >
              Reset
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!isDirty || updateProfile.isPending}
              className="bg-brand-700 text-white hover:bg-brand-800 focus-visible:ring-brand-700"
            >
              <Save size={16} strokeWidth={1.9} />
              {updateProfile.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </Card.Content>
    </Card>
  );
};

export default ProfileSettings;
