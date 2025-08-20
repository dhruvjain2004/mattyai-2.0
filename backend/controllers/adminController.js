import User from "../models/User.js";
import Design from "../models/Design.js";
import cloudinary from "../config/cloudinary.js";

// Users
export const listUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { passwordHash: 0 }).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { role } },
      { new: true, projection: { passwordHash: 0 } }
    );
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const designs = await Design.find({ userId: user._id }).lean();
    for (const d of designs) {
      if (d.thumbnailPublicId) {
        try { await cloudinary.uploader.destroy(d.thumbnailPublicId); } catch {}
      }
    }
    await Design.deleteMany({ userId: user._id });
    return res.json({ success: true, message: "User and related designs deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Designs
export const listDesigns = async (req, res) => {
  try {
    const designs = await Design.find({}).sort({ updatedAt: -1 }).lean();
    return res.json({ success: true, designs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDesignByIdAdmin = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id).lean();
    if (!design) return res.status(404).json({ success: false, message: "Design not found" });
    return res.json({ success: true, design });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDesignAdmin = async (req, res) => {
  try {
    const update = {};
    if (typeof req.body.title === "string") update.title = req.body.title;
    if (typeof req.body.isPublic !== "undefined") {
      update.isPublic = req.body.isPublic === true || req.body.isPublic === "true";
    }
    if (typeof req.body.tags !== "undefined") {
      update.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : String(req.body.tags).split(",").map(t => t.trim());
    }
    const design = await Design.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    if (!design) return res.status(404).json({ success: false, message: "Design not found" });
    return res.json({ success: true, design });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDesignAdmin = async (req, res) => {
  try {
    const design = await Design.findByIdAndDelete(req.params.id);
    if (!design) return res.status(404).json({ success: false, message: "Design not found" });
    if (design.thumbnailPublicId) {
      try { await cloudinary.uploader.destroy(design.thumbnailPublicId); } catch {}
    }
    return res.json({ success: true, message: "Design deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


