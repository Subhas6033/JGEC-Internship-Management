import React, { useEffect, useState } from "react";
import { Input, Select, Button } from "../../../../Components/index";
import { industryOptions } from "./companies.data";

const emptyForm = {
  name: "",
  shortName: "",
  industry: "",
  website: "",
  email: "",
  phone: "",
  location: "",
  description: "",
};

const CompanyForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData || emptyForm);
    setErrors({});
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Company name is required.";
    }

    if (!formData.shortName.trim()) {
      nextErrors.shortName = "Short name is required.";
    }

    if (!formData.industry) {
      nextErrors.industry = "Please select an industry.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!formData.location.trim()) {
      nextErrors.location = "Location is required.";
    }

    if (formData.website && !/^https?:\/\/.+/i.test(formData.website)) {
      nextErrors.website =
        "Enter a valid URL starting with http:// or https://.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Organisation Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter organisation name"
          error={errors.name}
          required
          animate={false}
        />

        <Input
          label="Short Name"
          name="shortName"
          value={formData.shortName}
          onChange={handleChange}
          placeholder="e.g. TCS"
          error={errors.shortName}
          required
          animate={false}
        />

        <Select
          label="Industry"
          name="industry"
          value={formData.industry}
          onChange={handleChange}
          options={industryOptions}
          placeholder="Select industry"
          required
        />

        <Input
          label="Organisation Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="company@example.com"
          error={errors.email}
          required
          animate={false}
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 XXXXX XXXXX"
          animate={false}
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="City, Country"
          error={errors.location}
          required
          animate={false}
        />

        <div className="sm:col-span-2">
          <Input
            label="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://www.example.com"
            error={errors.website}
            animate={false}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium text-ink">
            Organisation Description
          </label>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Enter organisation description..."
            className="w-full resize-y rounded-lg border border-border bg-cream-soft p-3 text-sm text-ink outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-600/15"
          />
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-4 sm:flex-row">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit">
          {initialData ? "Save Changes" : "Add Organisation"}
        </Button>
      </div>
    </form>
  );
};

export default CompanyForm;
