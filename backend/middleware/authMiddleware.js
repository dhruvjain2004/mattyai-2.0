
import jwt from "jsonwebtoken";
import { success } from "zod/v4";

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
