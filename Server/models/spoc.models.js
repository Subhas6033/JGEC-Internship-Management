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

const spocSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    spocId: {
      type: String,
      required: [true, "SPOC ID is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
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
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["spoc"],
      default: "spoc",
      immutable: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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

// Hash the password before saving
spocSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare the login password with the actual password
spocSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const SPOC = mongoose.models.SPOC || mongoose.model("SPOC", spocSchema);
