import { useEffect, useState } from "react";
import { Input, Select, Button, Modal } from "../../../../Components/index";

import { departments, academicYears } from "./adminStudents.data";

const emptyForm = {
  name: "",
  rollNumber: "",
  email: "",
  phone: "",
  department: "",
  academicYear: "",
  admissionYear: "",
  status: "Active",
};

const StudentForm = ({ open, onClose, onSubmit, student }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        rollNumber: student.rollNumber || "",
        email: student.email || "",
        phone: student.phone || "",
        department: student.department || "",
        academicYear: student.academicYear || "",
        admissionYear: student.admissionYear || "",
        status: student.status || "Active",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
  }, [student, open]);

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = "Roll number is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!formData.department) {
      newErrors.department = "Select a department";
    }

    if (!formData.academicYear) {
      newErrors.academicYear = "Select an academic year";
    }

    if (!formData.admissionYear.trim()) {
      newErrors.admissionYear = "Admission year is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={student ? "Edit Student" : "Add Student"}
      description={
        student
          ? "Update the student's information."
          : "Register a student in the portal."
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Student Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            error={errors.name}
            required
          />

          <Input
            label="Roll Number"
            placeholder="Enter roll number"
            value={formData.rollNumber}
            onChange={(e) => updateField("rollNumber", e.target.value)}
            error={errors.rollNumber}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="student@example.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            error={errors.email}
            required
          />

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            error={errors.phone}
            required
          />

          <Select
            label="Department"
            placeholder="Select department"
            value={formData.department}
            onChange={(value) => updateField("department", value)}
            options={departments.map((department) => ({
              label: department,
              value: department,
            }))}
            error={errors.department}
            required
          />

          <Select
            label="Academic Year"
            placeholder="Select academic year"
            value={formData.academicYear}
            onChange={(value) => updateField("academicYear", value)}
            options={academicYears.map((year) => ({
              label: year,
              value: year,
            }))}
            error={errors.academicYear}
            required
          />

          <Input
            label="Admission Year"
            placeholder="e.g. 2023"
            value={formData.admissionYear}
            onChange={(e) => updateField("admissionYear", e.target.value)}
            error={errors.admissionYear}
            required
          />

          <Select
            label="Account Status"
            value={formData.status}
            onChange={(value) => updateField("status", value)}
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit">
            {student ? "Save Changes" : "Add Student"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;
