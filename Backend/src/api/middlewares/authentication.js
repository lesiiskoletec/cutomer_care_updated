import jwt from "jsonwebtoken";
import User from "../../infastructure/schemas/user.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const secret = process.env.JWT_SECRET || "dev_secret_change_me";
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};
