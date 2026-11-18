import { Building2, GraduationCap, Mail, Phone, UserRound } from "lucide-react";

import { Modal, Button } from "../../../../Components/index";

const PersonRow = ({ person }) => (
  <div className="flex min-w-0 items-start gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-soft text-brand-600">
      <UserRound size={17} />
    </div>

    <div className="min-w-0">
      <p className="text-sm font-medium text-ink">{person.name}</p>

      <p className="mt-0.5 flex items-center gap-1.5 wrap-break-word text-xs text-ink-muted">
        <Mail size={12} className="shrink-0" />
        {person.email}
      </p>

      {person.mobile && (
        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
          <Phone size={12} className="shrink-0" />
          {person.mobile}
        </p>
      )}
    </div>
  </div>
);

const PeopleSection = ({ title, people }) => (
  <div className="border-t border-border pt-5">
    <h4 className="mb-4 text-sm font-semibold text-ink">{title}</h4>

    {people?.length ? (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {people.map((person) => (
          <PersonRow key={person._id} person={person} />
        ))}
      </div>
    ) : (
      <p className="text-sm text-ink-muted">Not assigned</p>
    )}
  </div>
);

const DepartmentViewModal = ({ open, onClose, department }) => {
  if (!department) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Department Details"
      description="View department information and assigned staff."
      size="lg"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl bg-cream-soft p-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Building2 size={24} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-ink">{department.name}</h3>

            <p className="mt-1 text-sm text-ink-muted">
              Department Code: {department.code}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-cream-soft text-brand-600">
            <GraduationCap size={17} />
          </div>

          <div>
            <p className="text-xs text-ink-muted">Total Students</p>
            <p className="mt-1 text-sm font-medium text-ink">
              {department.studentCount}
            </p>
          </div>
        </div>

        <PeopleSection title="Departmental TPO" people={department.tpos} />
        <PeopleSection title="Departmental SPOC" people={department.spocs} />

        <div className="flex justify-end border-t border-border pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentViewModal;
