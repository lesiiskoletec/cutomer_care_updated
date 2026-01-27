import mongoose from "mongoose";
const { Schema } = mongoose;

// ✅ Sri Lanka phone: 0XXXXXXXXX OR 94XXXXXXXXX OR +94XXXXXXXXX
export const SL_PHONE_REGEX = /^(?:\+94|94|0)(?:7\d{8}|[1-9]\d{8})$/;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ✅ WhatsApp number (login uses this)
    phonenumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return SL_PHONE_REGEX.test(String(v));
        },
        message: "Invalid Sri Lankan phone number",
      },
    },

    // ✅ only required for students by controller
    district: { type: String, trim: true, default: "" },
    town: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },

    password: { type: String, required: true, select: false },

    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },

    // ✅ WhatsApp OTP verification status
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date, default: null },

    // ✅ teacher approval workflow
    isApproved: { type: Boolean, default: false },
    approvedAt: { type: Date, default: null },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
