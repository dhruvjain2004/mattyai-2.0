import express from "express";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";
import {
  listUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  listDesigns,
  getDesignByIdAdmin,
  updateDesignAdmin,
  deleteDesignAdmin,
} from "../controllers/adminController.js";

const router = express.Router();

// Bootstrap: promote current authenticated user to admin if no admins exist
router.post("/bootstrap", protect, async (req, res) => {
  try {
    const { default: User } = await import("../models/User.js");
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(400).json({ success: false, message: "Admin already exists" });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { role: "admin" } },
      { new: true, projection: { passwordHash: 0 } }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.use(protect, requireAdmin);

// Users
router.get("/users", listUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

// Designs
router.get("/designs", listDesigns);
router.get("/designs/:id", getDesignByIdAdmin);
router.put("/designs/:id", updateDesignAdmin);
router.delete("/designs/:id", deleteDesignAdmin);

export default router;


