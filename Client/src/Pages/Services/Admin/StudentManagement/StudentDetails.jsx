import {
  Mail,
  Phone,
  GraduationCap,
  CalendarDays,
  Hash,
  Building2,
} from "lucide-react";

import { Modal, Button } from "../../../../Components/index";
import StudentStatus from "./StudentStatus";

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="rounded-lg bg-cream-soft p-2 text-brand-600">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-ink">
        {value || "—"}
      </p>
    </div>
  </div>
);

const StudentDetails = ({ open, onClose, student, onEdit }) => {
  if (!student) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Student Profile"
      description="View the student's registered information."
      size="lg"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-cream-soft p-4 sm:flex-row sm:items-center">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-semibold text-white">
            {student.name?.charAt(0)?.toUpperCase() || "S"}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-ink">{student.name}</h3>

            <p className="mt-1 text-sm text-ink-muted">{student.rollNumber}</p>
          </div>

          <StudentStatus status={student.status} />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <DetailItem icon={Mail} label="Email Address" value={student.email} />

          <DetailItem icon={Phone} label="Phone Number" value={student.phone} />

          <DetailItem
            icon={Hash}
            label="Roll Number"
            value={student.rollNumber}
          />

          <DetailItem
            icon={Building2}
            label="Department"
            value={student.department}
          />

          <DetailItem
            icon={GraduationCap}
            label="Academic Year"
            value={student.academicYear}
          />

          <DetailItem
            icon={CalendarDays}
            label="Admission Year"
            value={student.admissionYear}
          />

          <DetailItem
            icon={CalendarDays}
            label="Registered On"
            value={
              student.joinedAt
                ? new Date(student.joinedAt).toLocaleDateString("en-IN")
                : "—"
            }
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button onClick={() => onEdit(student)}>Edit Student</Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentDetails;
