import mongoose from "mongoose";
import bcrypt from "bcrypt";

const ALLOWED_EMAIL_DOMAINS = process.env.COLLEGE_MAILS
  ? JSON.parse(process.env.COLLEGE_MAILS).map((domain) =>
      domain.trim().toLowerCase(),
    )
  : [];

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return false;
  }
  const domain = email.split("@")[1].toLowerCase();
  return ALLOWED_EMAIL_DOMAINS.includes(domain);
};

const tpoSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: isValidEmail,
        message: "Please use your official college email address",
      },
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please provide a valid mobile number"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      enum: {
        values: ["CSE", "ECE", "EE", "ME", "CE", "IT"],
        message: "Please select a valid department",
      },
    },
    tpoId: {
      type: String,
      required: [true, "TPO ID is required"],
      trim: true,
      uppercase: true,
      minlength: [3, "TPO ID must be at least 3 characters long"],
      maxlength: [10, "TPO ID cannot exceed 50 characters"],
      default: "",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["TPO"],
      default: "TPO",
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

tpoSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
tpoSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const TPO = mongoose.model("TPO", tpoSchema);
