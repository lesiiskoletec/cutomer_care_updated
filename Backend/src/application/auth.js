import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User, { SL_PHONE_REGEX } from "../infastructure/schemas/user.js";
import Otp from "../infastructure/schemas/otp.js";
import { sendWhatsApp } from "../api/whatsapp.js";
import { sendEmail } from "../api/email.js";

const OTP_TTL_MINUTES = 5;

const normalizeSLPhone = (phone) => {
  const p = String(phone).trim();
  if (p.startsWith("+94")) return p;
  if (p.startsWith("94")) return `+${p}`;
  if (p.startsWith("0")) return `+94${p.slice(1)}`;
  return p;
};

const safeUser = (u) => ({
  _id: u._id,
  name: u.name,
  email: u.email,
  phonenumber: u.phonenumber,
  district: u.district,
  town: u.town,
  address: u.address,
  role: u.role,
  isVerified: u.isVerified,
  verifiedAt: u.verifiedAt,
  isApproved: u.isApproved,
  approvedAt: u.approvedAt,
  approvedBy: u.approvedBy,
  createdAt: u.createdAt,
  updatedAt: u.updatedAt,
});

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const hashOtp = (code) => crypto.createHash("sha256").update(String(code)).digest("hex");

const issueToken = (userId) => {
  const secret = process.env.JWT_SECRET || "dev_secret_change_me";
  return jwt.sign({ id: userId }, secret, { expiresIn: "7d" });
};

const setAuthCookie = (res, token) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const sendOtpBoth = async ({ phone, email, otp, purpose }) => {
  const msg = `Your Lesi Iskole verification code is: ${otp} (valid for ${OTP_TTL_MINUTES} minutes)`;

  // ✅ WhatsApp
  try {
    await sendWhatsApp(phone, msg);
  } catch (e) {
    console.error("WhatsApp OTP send failed:", e?.message || e);
  }

  // ✅ Email (same OTP)
  if (email) {
    try {
      await sendEmail({
        to: email,
        subject:
          purpose === "reset_password"
            ? "Lesi Iskole Password Reset Code"
            : "Lesi Iskole Verification Code",
        text: msg,
        html: `
          <div style="font-family:Arial,sans-serif">
            <h2>Lesi Iskole</h2>
            <p>${purpose === "reset_password" ? "Password reset code:" : "Verification code:"}</p>
            <div style="font-size:28px;font-weight:bold;letter-spacing:3px">${otp}</div>
            <p style="margin-top:12px">This code is valid for ${OTP_TTL_MINUTES} minutes.</p>
          </div>
        `,
      });
    } catch (e) {
      console.error("Email OTP send failed:", e?.message || e);
    }
  }
};

// ✅ SIGNUP (admin/teacher/student)
export const signUp = async (req, res) => {
  try {
    const { name, email, whatsappnumber, password, role } = req.body;

    if (!name || !email || !whatsappnumber || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be admin, teacher, or student." });
    }

    if (!SL_PHONE_REGEX.test(String(whatsappnumber).trim())) {
      return res.status(400).json({
        message: "Invalid Sri Lankan phone number. Use 0XXXXXXXXX or +94XXXXXXXXX",
      });
    }

    const normalizedPhone = normalizeSLPhone(whatsappnumber);
    const normalizedEmail = String(email).toLowerCase().trim();

    const existsEmail = await User.findOne({ email: normalizedEmail });
    if (existsEmail) return res.status(409).json({ message: "Email already in use" });

    const existsPhone = await User.findOne({ phonenumber: normalizedPhone });
    if (existsPhone) return res.status(409).json({ message: "WhatsApp number already in use" });

    const hashedPass = await bcrypt.hash(String(password), 10);

    // ✅ save user (student details can be added later)
    const user = await User.create({
      name,
      email: normalizedEmail,
      phonenumber: normalizedPhone,
      district: "",
      town: "",
      address: "",
      password: hashedPass,
      role,
      isVerified: false,
      verifiedAt: null,
      isApproved: role === "teacher" ? false : true,
    });

    // ✅ OTP record
    await Otp.deleteMany({
      phonenumber: normalizedPhone,
      purpose: "verify_phone",
      consumedAt: null,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({
      phonenumber: normalizedPhone,
      email: normalizedEmail,
      codeHash: hashOtp(otp),
      purpose: "verify_phone",
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
    });

    await sendOtpBoth({ phone: normalizedPhone, email: normalizedEmail, otp, purpose: "verify_phone" });

    return res.status(201).json({
      message: "User created. OTP sent to WhatsApp + Email. Please verify.",
      user: safeUser(user),
    });
  } catch (err) {
    console.error("signUp error:", err);
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate email or phone" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ STUDENT DETAILS SUBMIT AFTER SIGNUP (before or after verify)
export const submitStudentDetails = async (req, res) => {
  try {
    const { whatsappnumber, district, town, address } = req.body;

    if (!whatsappnumber) return res.status(400).json({ message: "whatsappnumber is required" });

    const normalizedPhone = normalizeSLPhone(whatsappnumber);

    const user = await User.findOne({ phonenumber: normalizedPhone });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "student") {
      return res.status(400).json({ message: "Only students can submit student details" });
    }

    if (!district || !town || !address) {
      return res.status(400).json({ message: "district, town, address are required for students" });
    }

    user.district = district;
    user.town = town;
    user.address = address;
    await user.save();

    return res.status(200).json({ message: "Student details saved", user: safeUser(user) });
  } catch (err) {
    console.error("submitStudentDetails error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ RESEND OTP
export const sendVerificationCode = async (req, res) => {
  try {
    const { phonenumber } = req.body;
    if (!phonenumber) return res.status(400).json({ message: "phonenumber is required" });

    const normalizedPhone = normalizeSLPhone(phonenumber);

    const user = await User.findOne({ phonenumber: normalizedPhone });
    if (!user) return res.status(404).json({ message: "User not found for this phone" });

    if (user.isVerified) {
      return res.status(200).json({ message: "Already verified", phonenumber: normalizedPhone });
    }

    await Otp.deleteMany({
      phonenumber: normalizedPhone,
      purpose: "verify_phone",
      consumedAt: null,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({
      phonenumber: normalizedPhone,
      email: user.email || "",
      codeHash: hashOtp(otp),
      purpose: "verify_phone",
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
    });

    await sendOtpBoth({ phone: normalizedPhone, email: user.email, otp, purpose: "verify_phone" });

    return res.status(200).json({ message: "OTP sent via WhatsApp + Email", phonenumber: normalizedPhone });
  } catch (err) {
    console.error("sendVerificationCode error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ VERIFY OTP
export const verifyCode = async (req, res) => {
  try {
    const { phonenumber, code } = req.body;

    if (!phonenumber || !code) {
      return res.status(400).json({ message: "phonenumber and code are required" });
    }

    const normalizedPhone = normalizeSLPhone(phonenumber);

    const otpDoc = await Otp.findOne({
      phonenumber: normalizedPhone,
      purpose: "verify_phone",
      consumedAt: null,
    }).sort({ createdAt: -1 });

    if (!otpDoc) return res.status(400).json({ message: "No OTP found. Please resend code." });

    if (Date.now() > new Date(otpDoc.expiresAt).getTime()) {
      return res.status(400).json({ message: "Code expired. Please request a new one." });
    }

    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      return res.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const isMatch = hashOtp(code) === otpDoc.codeHash;

    otpDoc.attempts += 1;
    await otpDoc.save();

    if (!isMatch) return res.status(400).json({ message: "Invalid code" });

    otpDoc.consumedAt = new Date();
    await otpDoc.save();

    const user = await User.findOne({ phonenumber: normalizedPhone });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true;
    user.verifiedAt = new Date();
    await user.save();

    return res.status(200).json({ message: "Phone verified successfully", user: safeUser(user) });
  } catch (err) {
    console.error("verifyCode error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ SIGN IN (accept whatsappnumber OR phonenumber)
export const signIn = async (req, res) => {
  try {
    const { phonenumber, whatsappnumber, password } = req.body;

    const phoneInput = phonenumber || whatsappnumber;

    if (!phoneInput || !password) {
      return res.status(400).json({ message: "phonenumber and password are required" });
    }

    const normalizedPhone = normalizeSLPhone(phoneInput);

    const user = await User.findOne({ phonenumber: normalizedPhone }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid phone or password" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Phone not verified. Please verify OTP first." });
    }

    if (user.role === "teacher" && !user.isApproved) {
      return res.status(403).json({ message: "Teacher account not approved by admin yet." });
    }

    const ok = await bcrypt.compare(String(password), user.password);
    if (!ok) return res.status(401).json({ message: "Invalid phone or password" });

    const token = issueToken(user._id);
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Logged in successfully",
      token, // ✅ helpful for Postman (optional)
      user: safeUser(user),
    });
  } catch (err) {
    console.error("signIn error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ SIGN OUT
export const signOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    console.error("signOut error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ FORGOT PASSWORD: send OTP (phone/email)
export const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { identifier } = req.body; // phone or email
    if (!identifier) return res.status(400).json({ message: "identifier is required (phone or email)" });

    const looksEmail = String(identifier).includes("@");
    const normalizedEmail = looksEmail ? String(identifier).toLowerCase().trim() : "";
    const normalizedPhone = looksEmail ? "" : normalizeSLPhone(identifier);

    const user = looksEmail
      ? await User.findOne({ email: normalizedEmail })
      : await User.findOne({ phonenumber: normalizedPhone });

    if (!user) return res.status(404).json({ message: "User not found" });

    await Otp.deleteMany({
      phonenumber: user.phonenumber,
      purpose: "reset_password",
      consumedAt: null,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

    await Otp.create({
      phonenumber: user.phonenumber,
      email: user.email || "",
      codeHash: hashOtp(otp),
      purpose: "reset_password",
      expiresAt,
      attempts: 0,
      maxAttempts: 5,
    });

    await sendOtpBoth({ phone: user.phonenumber, email: user.email, otp, purpose: "reset_password" });

    return res.status(200).json({
      message: "Password reset OTP sent via WhatsApp + Email",
      identifier: looksEmail ? user.email : user.phonenumber,
    });
  } catch (err) {
    console.error("forgotPasswordSendOtp error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ FORGOT PASSWORD: verify OTP + reset password
export const forgotPasswordReset = async (req, res) => {
  try {
    const { identifier, code, newPassword, confirmPassword } = req.body;

    if (!identifier || !code || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "identifier, code, newPassword, confirmPassword are required" });
    }

    if (String(newPassword) !== String(confirmPassword)) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const looksEmail = String(identifier).includes("@");
    const normalizedEmail = looksEmail ? String(identifier).toLowerCase().trim() : "";
    const normalizedPhone = looksEmail ? "" : normalizeSLPhone(identifier);

    const user = looksEmail
      ? await User.findOne({ email: normalizedEmail })
      : await User.findOne({ phonenumber: normalizedPhone });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otpDoc = await Otp.findOne({
      phonenumber: user.phonenumber,
      purpose: "reset_password",
      consumedAt: null,
    }).sort({ createdAt: -1 });

    if (!otpDoc) return res.status(400).json({ message: "No OTP found. Please request OTP again." });

    if (Date.now() > new Date(otpDoc.expiresAt).getTime()) {
      return res.status(400).json({ message: "Code expired. Please request a new one." });
    }

    if (otpDoc.attempts >= otpDoc.maxAttempts) {
      return res.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const isMatch = hashOtp(code) === otpDoc.codeHash;

    otpDoc.attempts += 1;
    await otpDoc.save();

    if (!isMatch) return res.status(400).json({ message: "Invalid code" });

    otpDoc.consumedAt = new Date();
    await otpDoc.save();

    user.password = await bcrypt.hash(String(newPassword), 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("forgotPasswordReset error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
