import { GraduationCap, Mail, Phone, UserRound } from "lucide-react";
import { DetailsCard, DetailItem } from "./DetailComponents";

export default function StudentDetails({ student }) {
  return (
    <DetailsCard
      icon={<GraduationCap size={20} />}
      title="Student Details"
      description="Personal and academic information."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
        <DetailItem
          icon={<UserRound size={16} />}
          label="Full Name"
          value={student.name}
        />
        <DetailItem label="Roll Number" value={student.rollNumber} />
        <DetailItem label="Department" value={student.department} />
        <DetailItem label="Semester" value={student.semester} />
        <DetailItem
          icon={<Mail size={16} />}
          label="Email"
          value={student.email}
        />
        <DetailItem
          icon={<Phone size={16} />}
          label="Phone"
          value={student.phone}
        />
      </div>
    </DetailsCard>
  );
}
