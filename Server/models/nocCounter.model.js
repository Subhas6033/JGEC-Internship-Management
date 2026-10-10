import mongoose from "mongoose";

const nocCounterSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

/*
 * One independent counter for every:
 *
 * year + department
 *
 * Example:
 *
 * 2026 + CSE
 * 2026 + IT
 * 2026 + CE
 */
nocCounterSchema.index(
  {
    year: 1,
    department: 1,
  },
  {
    unique: true,
  },
);

export const NOCCounter = mongoose.model("NOCCounter", nocCounterSchema);
