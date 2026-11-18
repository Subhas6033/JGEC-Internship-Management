import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, Button, Modal } from "../../../../Components/index";
import { departments } from "./adminStudents.data";

const emptyForm = {
  fullName: "",
  email: "",
  mobileNumber: "",
  rollNumber: "",
  department: "",
  guardianName: "",
  guardianMobile: "",
};

const StudentForm = ({ open, onClose, onSubmit, student, loading = false }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      setFormData({
        fullName: student.fullName || "",
        email: student.email || "",
        mobileNumber: student.mobileNumber || "",
        rollNumber: student.rollNumber || "",
        department: student.department || "",
        guardianName: student.guardianName || "",
        guardianMobile: student.guardianMobile || "",
      });
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
  }, [student, open]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) {
      nextErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length > 50) {
      nextErrors.fullName = "Maximum 50 characters allowed";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email";
    }

    if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(formData.mobileNumber.trim())) {
      nextErrors.mobileNumber = "Enter a valid Indian mobile number";
    }

    if (!formData.rollNumber.trim()) {
      nextErrors.rollNumber = "Roll number is required";
    }

    if (!departments.includes(formData.department)) {
      nextErrors.department = "Select a department";
    }

    if (!formData.guardianName.trim()) {
      nextErrors.guardianName = "Guardian name is required";
    }

    if (!/^(?:\+91|91)?[6-9]\d{9}$/.test(formData.guardianMobile.trim())) {
      nextErrors.guardianMobile = "Enter a valid guardian mobile number";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit({
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobileNumber: formData.mobileNumber.trim(),
      rollNumber: formData.rollNumber.trim(),
      department: formData.department,
      guardianName: formData.guardianName.trim(),
      guardianMobile: formData.guardianMobile.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Student"
      description="Update the registered student information."
      size="lg"
    >
      <AnimatePresence mode="wait">
        {open && (
          <motion.form
            key={student?._id || "student-form"}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                error={errors.fullName}
                required
              />

              <Input
                label="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => updateField("rollNumber", e.target.value)}
                error={errors.rollNumber}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => updateField("mobileNumber", e.target.value)}
                error={errors.mobileNumber}
                required
              />

              <Select
                label="Department"
                value={formData.department}
                onChange={(value) => updateField("department", value)}
                options={departments.map((department) => ({
                  label: department,
                  value: department,
                }))}
                error={errors.department}
                required
              />

              <Input
                label="Guardian Name"
                value={formData.guardianName}
                onChange={(e) => updateField("guardianName", e.target.value)}
                error={errors.guardianName}
                required
              />

              <Input
                label="Guardian Mobile"
                value={formData.guardianMobile}
                onChange={(e) => updateField("guardianMobile", e.target.value)}
                error={errors.guardianMobile}
                required
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-border pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default StudentForm;
