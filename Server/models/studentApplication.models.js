import mongoose from "mongoose";

const studentApplicationSchema = new mongoose.Schema(
  {
    // Student who is submitting the application
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    // Semester selected by the student
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    // Existing organisation selected from the backend
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      default: null,
      index: true,
      required: true,
    },
    // Person/employee whom the student is applying to
    organisationsEmployye: {
      type: String,
      required: true,
      trim: true,
    },
    // Internship designation
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    // Internship details
    tentativeStartDate: {
      type: Date,
      required: true,
    },
    tentativeEndDate: {
      type: Date,
      required: true,
    },
    tentativeWorkLocations: {
      type: [String],
      required: true,
      validate: {
        validator: (locations) =>
          Array.isArray(locations) && locations.length > 0,
        message: "At least one tentative work location is required",
      },
    },
    modeOfInternship: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      required: true,
    },
    internshipType: {
      type: String,
      enum: ["summer", "winter", "semester", "fulltime", "others"],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    /**
     * Update required information
     *
     * These fields are populated ONLY when a TPO or SPOC
     * sends the application back to the student.
     */
    updateRequiredReason: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    updateRequiredBy: {
      type: String,
      enum: ["tpo", "spoc"],
      default: null,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_tpo_review",
        "update_required",
        "approved_by_tpo",
        "under_spoc_review",
        "approved_by_spoc",
        "rejected",
        "withdrawn",
      ],
      default: "submitted",
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

studentApplicationSchema.index({
  student: 1,
  organisation: 1,
});

export const StudentApplication = mongoose.model(
  "StudentApplication",
  studentApplicationSchema,
);
