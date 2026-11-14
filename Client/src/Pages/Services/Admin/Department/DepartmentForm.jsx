import { useEffect, useState } from "react";
import { Modal, Input, Select, Button } from "../../../../Components/index";

import { departmentStatusOptions } from "./adminDepartments.data";

const emptyForm = {
  name: "",
  code: "",
  hodName: "",
  hodEmail: "",
  tpoName: "",
  tpoEmail: "",
  studentCount: 0,
  establishedYear: "",
  description: "",
  status: "Active",
};

const DepartmentForm = ({ open, onClose, onSubmit, department }) => {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (open) {
      setFormData(department ? { ...emptyForm, ...department } : emptyForm);
    }
  }, [department, open]);

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      code: formData.code.trim().toUpperCase(),
      studentCount: Number(formData.studentCount) || 0,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={department ? "Edit Department" : "Add Department"}
      description={
        department
          ? "Update department information."
          : "Enter the details to register a new department."
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Department Name"
            placeholder="e.g. Computer Science and Engineering"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />

          <Input
            label="Department Code"
            placeholder="e.g. CSE"
            value={formData.code}
            onChange={(e) => handleChange("code", e.target.value)}
            required
          />

          <Input
            label="Head of Department"
            placeholder="Enter HOD name"
            value={formData.hodName}
            onChange={(e) => handleChange("hodName", e.target.value)}
            required
          />

          <Input
            label="HOD Email"
            inputType="email"
            placeholder="hod@jgec.ac.in"
            value={formData.hodEmail}
            onChange={(e) => handleChange("hodEmail", e.target.value)}
            required
          />

          <Input
            label="Departmental TPO"
            placeholder="Enter TPO name"
            value={formData.tpoName}
            onChange={(e) => handleChange("tpoName", e.target.value)}
          />

          <Input
            label="TPO Email"
            inputType="email"
            placeholder="tpo@jgec.ac.in"
            value={formData.tpoEmail}
            onChange={(e) => handleChange("tpoEmail", e.target.value)}
          />

          <Input
            label="Established Year"
            placeholder="e.g. 2002"
            value={formData.establishedYear}
            onChange={(e) => handleChange("establishedYear", e.target.value)}
          />

          <Input
            label="Student Count"
            inputType="number"
            placeholder="Enter number of students"
            value={formData.studentCount}
            onChange={(e) => handleChange("studentCount", e.target.value)}
          />

          <div className="sm:col-span-2">
            <Select
              label="Department Status"
              value={formData.status}
              onChange={(value) => handleChange("status", value)}
              options={departmentStatusOptions}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Description
            </label>

            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter department description..."
              className="w-full resize-none rounded-xl border border-border bg-cream-soft px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/10"
            />
          </div>
        </div>

        <div className="flex flex-col-reverse justify-end gap-2 border-t border-border pt-4 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {department ? "Save Changes" : "Add Department"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default DepartmentForm;
