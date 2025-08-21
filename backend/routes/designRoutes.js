import express from "express";
import multer from "multer";
import { body, validationResult } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from "../controllers/designController.js";
import { exportDesignImage } from "../controllers/designController.js";

const router = express.Router();

// Multer temp storage with limits
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

// Middleware for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Routes
router.get("/", protect, getMyDesigns);
router.get("/:id", protect, getDesignById);

router.post(
  "/",
  protect,
  upload.single("thumbnail"),
  [
    body("title").optional().isString(),
    body("jsonData").optional().isString(),
  ],
  validate,
  createDesign
);

router.put(
  "/:id",
  protect,
  upload.single("thumbnail"),
  [
    body("title").optional().isString(),
    body("jsonData").optional(),
  ],
  validate,
  updateDesign
);

router.delete("/:id", protect, deleteDesign);

router.post("/:id/export", protect, [body("image").isString()], validate, exportDesignImage);

export default router;

