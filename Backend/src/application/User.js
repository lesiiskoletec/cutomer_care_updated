import bcrypt from "bcryptjs";
import User, { SL_PHONE_REGEX } from "../infastructure/schemas/user.js";

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

export const createUser = async (req, res) => {
  try {
    const { name, email, whatsappnumber, district, town, address, password, role } = req.body;

    if (!name || !email || !whatsappnumber || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["admin", "teacher", "student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role. Must be admin, teacher, or student." });
    }

    if (role === "student" && (!district || !town || !address)) {
      return res.status(400).json({ message: "Student must provide district, town, address" });
    }

    if (!SL_PHONE_REGEX.test(String(whatsappnumber).trim())) {
      return res.status(400).json({
        message: "Invalid Sri Lankan phone number. Use 0XXXXXXXXX or +94XXXXXXXXX",
      });
    }

    const normalizedPhone = normalizeSLPhone(whatsappnumber);

    const existsEmail = await User.findOne({ email: String(email).toLowerCase().trim() });
    if (existsEmail) return res.status(409).json({ message: "Email already in use" });

    const existsPhone = await User.findOne({ phonenumber: normalizedPhone });
    if (existsPhone) return res.status(409).json({ message: "WhatsApp number already in use" });

    const hashed = await bcrypt.hash(String(password), 10);

    const user = await User.create({
      name,
      email: String(email).toLowerCase().trim(),
      phonenumber: normalizedPhone,
      district: role === "student" ? district : "",
      town: role === "student" ? town : "",
      address: role === "student" ? address : "",
      password: hashed,
      role,

      // ✅ admin-created users can be marked verified if YOU want.
      // For safety: keep false (user must verify OTP) OR set true for internal staff accounts.
      isVerified: false,
      verifiedAt: null,

      isApproved: role === "teacher" ? false : true,
    });

    return res.status(201).json({ message: "User created", user: safeUser(user) });
  } catch (err) {
    console.error("createUser error:", err);
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate email or phone" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ users: users.map(safeUser) });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user: safeUser(user) });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, whatsappnumber, district, town, address, password, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = String(email).toLowerCase().trim();

    if (role) {
      if (!["admin", "teacher", "student"].includes(role)) {
        return res.status(400).json({ message: "Invalid role. Must be admin, teacher, or student." });
      }
      updateData.role = role;

      // ✅ if admin changes role away from teacher, mark approved true
      if (role !== "teacher") {
        updateData.isApproved = true;
        updateData.approvedAt = null;
        updateData.approvedBy = null;
      }
    }

    if (whatsappnumber) {
      if (!SL_PHONE_REGEX.test(String(whatsappnumber).trim())) {
        return res.status(400).json({
          message: "Invalid Sri Lankan phone number. Use 0XXXXXXXXX or +94XXXXXXXXX",
        });
      }
      updateData.phonenumber = normalizeSLPhone(whatsappnumber);

      // ✅ phone changed => must verify again
      updateData.isVerified = false;
      updateData.verifiedAt = null;
    }

    if (district !== undefined) updateData.district = district;
    if (town !== undefined) updateData.town = town;
    if (address !== undefined) updateData.address = address;

    if (password) updateData.password = await bcrypt.hash(String(password), 10);

    const updated = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ message: "User updated", user: safeUser(updated) });
  } catch (err) {
    console.error("updateUser error:", err);
    if (err.code === 11000) return res.status(409).json({ message: "Duplicate email or phone" });
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted", user: safeUser(deleted) });
  } catch (err) {
    console.error("deleteUserById error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const approveTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "User not found" });
    if (teacher.role !== "teacher") return res.status(400).json({ message: "This user is not a teacher" });

    teacher.isApproved = true;
    teacher.approvedAt = new Date();
    teacher.approvedBy = req.user.id;

    await teacher.save();

    return res.status(200).json({ message: "Teacher approved successfully", user: safeUser(teacher) });
  } catch (err) {
    console.error("approveTeacher error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
