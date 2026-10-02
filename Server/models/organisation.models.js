import mongoose from "mongoose";

const organisationSchema = new mongoose.Schema(
  {
    organisationName: {
      type: String,
      required: [true, "Organisation Name is required"],
      trim: true,
      unique: true,
    },

    organisationSite: {
      type: String,
      required: [true, "Organisation Site is required"],
      trim: true,
    },

    organisationLocation: {
      type: String,
      required: [true, "Organisation Location is required"],
      trim: true,
    },

    organisationMail: {
      type: String,
      required: [true, "Organisation Mail is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid organisation email",
      ],
    },
  },
  {
    timestamps: true,
  },
);

organisationSchema.index({ organisationName: 1 });

export const Organisation = mongoose.model("Organisation", organisationSchema);
