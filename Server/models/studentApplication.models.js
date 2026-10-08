import mongoose from "mongoose";

const studentApplicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organisation",
      required: true,
      index: true,
    },
    organisationsEmployye: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
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
        "noc_generated",
      ],
      default: "submitted",
      index: true,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    rejectedBy: {
      type: String,
      enum: ["tpo", "spoc"],
      default: null,
    },
    tpoReviewedAt: {
      type: Date,
      default: null,
    },
    tpoReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    spocReviewedAt: {
      type: Date,
      default: null,
    },
    spocReviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    nocGeneratedAt: {
      type: Date,
      default: null,
    },
    noc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NOC",
      default: null,
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

studentApplicationSchema.index({
  status: 1,
  organisation: 1,
});

studentApplicationSchema.index({
  status: 1,
  tpoReviewedBy: 1,
});

studentApplicationSchema.index({
  status: 1,
  spocReviewedBy: 1,
});

export const StudentApplication = mongoose.model(
  "StudentApplication",
  studentApplicationSchema,
);
