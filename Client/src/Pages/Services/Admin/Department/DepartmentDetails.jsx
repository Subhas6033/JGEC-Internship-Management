import { Building2, GraduationCap, Mail, UserRound } from "lucide-react";

import { Modal, Button } from "../../../../Components/index";
import DepartmentStatus from "./DepartmentStatus";

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex min-w-0 gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-soft text-brand-600">
      <Icon size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-xs text-ink-muted">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-medium text-ink">
        {value || "Not assigned"}
      </p>
    </div>
  </div>
);

const DepartmentDetails = ({ open, onClose, department, onEdit }) => {
  if (!department) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Department Details"
      description="View department information and assigned personnel."
      size="lg"
    >
      <div className="space-y-5">
        {/* Department heading */}
        <div className="flex items-start gap-3 rounded-xl bg-cream-soft p-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Building2 size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-ink">{department.name}</h3>

            <p className="mt-1 text-sm text-ink-muted">
              Department Code: {department.code}
            </p>

            <div className="mt-2">
              <DepartmentStatus status={department.status} />
            </div>
          </div>
        </div>

        {/* Department information */}
        <div>
          <h4 className="mb-4 text-sm font-semibold text-ink">
            Department Information
          </h4>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem
              icon={GraduationCap}
              label="Total Students"
              value={department.studentCount}
            />

            <DetailItem
              icon={Building2}
              label="Established Year"
              value={department.establishedYear}
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h4 className="mb-4 text-sm font-semibold text-ink">
            Head of Department
          </h4>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem
              icon={UserRound}
              label="HOD Name"
              value={department.hodName}
            />

            <DetailItem
              icon={Mail}
              label="HOD Email"
              value={department.hodEmail}
            />
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h4 className="mb-4 text-sm font-semibold text-ink">
            Departmental TPO
          </h4>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <DetailItem
              icon={UserRound}
              label="TPO Name"
              value={department.tpoName}
            />

            <DetailItem
              icon={Mail}
              label="TPO Email"
              value={department.tpoEmail}
            />
          </div>
        </div>

        {department.description && (
          <div className="border-t border-border pt-5">
            <h4 className="mb-2 text-sm font-semibold text-ink">Description</h4>

            <p className="text-sm leading-6 text-ink-muted">
              {department.description}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>

          <Button onClick={() => onEdit(department)}>Edit Department</Button>
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentDetails;
