import { LockKeyhole } from "lucide-react";
import { useSelector } from "react-redux";
import { Card, Select } from "../../../../Components/index";
import { selectUser } from "../../../../Store/Slice/authSlice";

const departmentMap = {
  CE: "Civil Engineering",
  EE: "Electrical Engineering",
  ME: "Mechanical Engineering",
  CSE: "Computer Science and Engineering",
  ECE: "Electronics and Communication Engineering",
  IT: "Information Technology",
};

const StudentDetailsStep = ({ register, errors }) => {
  const student = useSelector(selectUser);

  const semesterOptions = [
    {
      label: "Semester 1",
      value: "1",
    },
    {
      label: "Semester 2",
      value: "2",
    },
    {
      label: "Semester 3",
      value: "3",
    },
    {
      label: "Semester 4",
      value: "4",
    },
    {
      label: "Semester 5",
      value: "5",
    },
    {
      label: "Semester 6",
      value: "6",
    },
    {
      label: "Semester 7",
      value: "7",
    },
    {
      label: "Semester 8",
      value: "8",
    },
  ];

  return (
    <Card className="overflow-hidden border-border bg-cream-soft shadow-card">
      <Card.Header className="border-b border-border px-5 py-5 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Card.Title className="text-base font-semibold text-ink sm:text-lg">
              Student information
            </Card.Title>

            <Card.Description className="mt-1.5 leading-5 text-ink-muted">
              These details are fetched from your student profile.
            </Card.Description>
          </div>

          <div className="hidden shrink-0 items-center gap-1.5 rounded-full bg-cream-dark px-2.5 py-1 text-[10px] font-medium text-ink-muted sm:flex">
            <LockKeyhole size={12} />
            Profile data
          </div>
        </div>
      </Card.Header>

      <Card.Content className="px-5 py-5 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 m-2">
          <div className="sm:col-span-2">
            <ReadOnlyField label="Full name" value={student?.fullName} />
          </div>

          <ReadOnlyField label="Roll Number" value={student?.rollNumber} />

          <ReadOnlyField
            label="Department"
            value={departmentMap[student?.department] || student?.department}
          />

          <ReadOnlyField label="Phone" value={student?.mobileNumber} />

          <div className="sm:col-span-2">
            <ReadOnlyField label="Email" value={student?.email} />
          </div>

          <div className="sm:col-span-2">
            <Select
              label="Current semester"
              required
              options={semesterOptions}
              error={errors.semester?.message}
              {...register("semester", {
                required: "Please select your current semester.",
              })}
            />
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-lg border border-border bg-cream px-3.5 py-3">
          <LockKeyhole size={15} className="mt-0.5 shrink-0 text-ink-muted" />

          <p className="text-xs leading-5 text-ink-muted">
            Your personal and academic details are taken directly from your
            student profile and cannot be edited here.
          </p>
        </div>
      </Card.Content>
    </Card>
  );
};

const ReadOnlyField = ({ label, value }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>

      <div
        className="
          flex min-h-10 w-full items-center
          rounded-md border border-border
          bg-cream px-3 py-2
          text-sm text-ink
        "
      >
        {value || "Not available"}
      </div>
    </div>
  );
};

export default StudentDetailsStep;
