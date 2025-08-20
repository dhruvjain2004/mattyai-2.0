
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader) {
  return res.status(401).json({ success: false, message: "Authorization header missing" });
}
const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied",success:false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const user = await User.findById(req.user.id).lean();
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.user.role = user.role;
    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
