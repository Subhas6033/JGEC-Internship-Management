import mongoose from "mongoose";

const ALLOWED_EMAIL_DOMAINS = [process.env.COLLEGE_MAILS];

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
      maxlength: [50, "Full name can't be over 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Please provide the college email"],
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
      validate: {
        validator: isAllowedCollegeEmail,
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
      select: false,
    },

    rollNumber: {
      type: String,
      required: [true, "Please provide the roll number"],
      trim: true,
      unique: true,
    },
    // Cloudinary URL of the uploaded signature image
    signature: {
      type: String,
      required: [true, "Signature is required"],
      trim: true,
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Student = mongoose.model("Student", studentSchema);
