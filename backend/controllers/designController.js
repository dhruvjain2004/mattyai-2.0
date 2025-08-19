import fs from "fs";
import { validationResult } from "express-validator";
import Design from "../models/Design.js";
import cloudinary from "../config/cloudinary.js";

export const getMyDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ userId: req.user.id }).sort({ updatedAt: -1 });
    return res.json({ success: true, designs });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getDesignById = async (req, res) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, userId: req.user.id });
    if (!design) {
      return res.status(404).json({ success: false, message: "Design not found" });
    }
    return res.json({ success: true, design });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createDesign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let thumbnailUrl = "";
    let thumbnailPublicId = "";

    // Handle thumbnail from base64 data - store directly for now
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      thumbnailUrl = req.body.thumbnail; // Store base64 directly
      console.log("Storing base64 thumbnail, length:", req.body.thumbnail.length);
    }
    // Handle file upload (fallback)
    else if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "matty/thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = upload.secure_url;
      thumbnailPublicId = upload.public_id;
      fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
    }

    let jsonData = {};
    try {
      jsonData =
        typeof req.body.jsonData === "string"
          ? JSON.parse(req.body.jsonData || "{}")
          : (req.body.jsonData || {});
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid design JSON data" });
    }

    const doc = await Design.create({
      userId: req.user.id,
      title: req.body.title,
      jsonData,
      thumbnailUrl,
      thumbnailPublicId,
      tags: req.body.tags ? req.body.tags.split(",").map(t => t.trim()) : [],
      isPublic: req.body.isPublic === "true" || req.body.isPublic === true,
    });

    console.log("Design created with thumbnail:", !!doc.thumbnailUrl);
    res.status(201).json(doc);
  } catch (err) {
    console.error("Create design error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateDesign = async (req, res) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, userId: req.user.id });
    if (!design) {
      return res.status(404).json({ success: false, message: "Design not found" });
    }

    if (typeof req.body.title === "string") design.title = req.body.title;

    if (req.body.jsonData) {
      try {
        const parsed =
          typeof req.body.jsonData === "string" ? JSON.parse(req.body.jsonData) : req.body.jsonData;
        design.jsonData = parsed;
        design.version = (design.version || 1) + 1;
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON format for design data" });
      }
    }

    if (typeof req.body.isPublic !== "undefined") {
      design.isPublic = req.body.isPublic === "true" || req.body.isPublic === true;
    }

    if (req.body.tags) {
      design.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags.split(",").map(t => t.trim());
    }

    // Handle thumbnail from base64 data - store directly for now
    if (req.body.thumbnail && req.body.thumbnail.startsWith('data:image')) {
      design.thumbnailUrl = req.body.thumbnail; // Store base64 directly
      console.log("Updating with base64 thumbnail, length:", req.body.thumbnail.length);
    }
    // Handle file upload (fallback)
    else if (req.file) {
      // Delete old thumbnail from Cloudinary if exists
      if (design.thumbnailPublicId) {
        await cloudinary.uploader.destroy(design.thumbnailPublicId);
      }
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "matty/thumbnails",
        resource_type: "image",
      });
      design.thumbnailUrl = upload.secure_url;
      design.thumbnailPublicId = upload.public_id;
      fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
    }

    await design.save();

    console.log("Design updated with thumbnail:", !!design.thumbnailUrl);
    res.json({ success: true, message: "Design updated successfully", design });
  } catch (err) {
    console.error("Update design error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

  // export const deleteDesign = async (req, res) => {
  //   try {
  //     const design = await Design.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  //     if (!design) {
  //       return res.status(404).json({ success: false, message: "Design not found" });
  //     }

  //     if (design.thumbnailPublicId) {
  //       await cloudinary.uploader.destroy(design.thumbnailPublicId);
  //     }

  //     return res.json({ success: true, message: "Design deleted successfully" });
  //   } catch (err) {
  //     return res.status(500).json({ success: false, message: err.message });
  //   }};
  //   } catch (err) {
  //     console.error("Update design error:", err);
  //     res.status(500).json({ message: err.message });

  //   }
  // };
export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!design) {
      return res.status(404).json({ success: false, message: "Design not found" });
    }

    if (design.thumbnailPublicId) {
      await cloudinary.uploader.destroy(design.thumbnailPublicId);
    }

    return res.json({ success: true, message: "Design deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
