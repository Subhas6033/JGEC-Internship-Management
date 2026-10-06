import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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

const studentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name can't be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide the college email"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      validate: {
        validator: isValidEmail,
        message: "Please use your official college email address",
      },
    },
    mobileNumber: {
      type: String,
      required: [true, "Please provide the mobile number"],
      trim: true,
      match: [
        /^(?:\+91|91)?[6-9]\d{9}$/,
        "Please provide a valid Indian mobile number",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must have at least 6 characters"],
      maxlength: [20, "Password can't have more than 20 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      ],
      select: false,
    },
    rollNumber: {
      type: String,
      required: [true, "Please provide the roll number"],
      trim: true,
      unique: true,
    },
    department: {
      type: String,
      enum: ["CE", "EE", "ME", "CSE", "ECE", "IT"],
      required: [true, "Department Name is required"],
      default: "CE",
    },
    // Stores the URL of the processed transparent PNG signature.
    signature: {
      type: String,
      required: [true, "Signature is required"],
      trim: true,
    },
    guardianName: {
      type: String,
      required: [true, "Guardian Name is required"],
      trim: true,
    },
    guardianMobile: {
      type: String,
      required: [true, "Please provide the guardian mobile number"],
      trim: true,
      match: [
        /^(?:\+91|91)?[6-9]\d{9}$/,
        "Please provide a valid Indian mobile number",
      ],
    },
    role: {
      type: String,
      enum: ["student"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

// Hash the password before saving in DB.
studentSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password.
studentSchema.methods.isPasswordValid = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate Access Token.
studentSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      sub: this._id.toString(),
      role: this.role,
      name: this.fullName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      issuer: process.env.ACCESS_TOKEN_ISSUER,
      audience: process.env.ACCESS_TOKEN_AUDIENCE,
    },
  );
};

export const Student = mongoose.model("Student", studentSchema);
