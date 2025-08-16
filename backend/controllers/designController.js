
import fs from "fs";
import { validationResult } from "express-validator";
import Design from "../models/Design.js";
import cloudinary from "../config/cloudinary.js";

export const getMyDesigns = async (req, res) => {
  const designs = await Design.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(designs);
};

export const getDesignById = async (req, res) => {
  const design = await Design.findOne({ _id: req.params.id, userId: req.user.id });
  if (!design) return res.status(404).json({ message: "Design not found" });
  res.json(design);
};

export const createDesign = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let thumbnailUrl = "";
    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "matty/thumbnails",
        resource_type: "image",
      });
      thumbnailUrl = upload.secure_url;
      fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
    }

    const doc = await Design.create({
      userId: req.user.id,
      title: req.body.title,
      jsonData: JSON.parse(req.body.jsonData || "{}"),
      thumbnailUrl,
      tags: req.body.tags ? req.body.tags.split(",").map(t => t.trim()) : [],
      isPublic: req.body.isPublic === "true",
    });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateDesign = async (req, res) => {
  try {
    const design = await Design.findOne({ _id: req.params.id, userId: req.user.id });
    if (!design) return res.status(404).json({ message: "Design not found" });

    if (typeof req.body.title === "string") design.title = req.body.title;
    if (req.body.jsonData) {
      const parsed = typeof req.body.jsonData === "string" ? JSON.parse(req.body.jsonData) : req.body.jsonData;
      design.jsonData = parsed;
      design.version = (design.version || 1) + 1;
    }
    if (typeof req.body.isPublic !== "undefined") {
      design.isPublic = req.body.isPublic === "true" || req.body.isPublic === true;
    }
    if (req.body.tags) {
      design.tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags.split(",").map(t => t.trim());
    }

    if (req.file) {
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "matty/thumbnails",
        resource_type: "image",
      });
      design.thumbnailUrl = upload.secure_url;
      fs.existsSync(req.file.path) && fs.unlinkSync(req.file.path);
    }

    await design.save();
    res.json({ message: "Design updated successfully", design });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDesign = async (req, res) => {
  try {
    const design = await Design.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!design) return res.status(404).json({ message: "Design not found" });
    res.json({ message: "Design deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
