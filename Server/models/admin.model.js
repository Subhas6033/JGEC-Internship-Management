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

const adminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must contain at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
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
      match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit mobile number"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },
    // Stores the URL of the processed transparent PNG signature.
    signature: {
      type: String,
      trim: true,
      default: "",
    },
    signaturePublicId: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
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

// Hash the password before saving.
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare the submitted password with the stored hash.
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Admin =
  mongoose.models.Admin || mongoose.model("Admin", adminSchema);
