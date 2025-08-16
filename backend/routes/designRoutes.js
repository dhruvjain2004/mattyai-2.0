
import express from "express";
import multer from "multer";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  getMyDesigns,
  getDesignById,
  createDesign,
  updateDesign,
  deleteDesign,
} from "../controllers/designController.js";

const router = express.Router();

// Multer temp storage to uploads/ (files deleted after Cloudinary upload)
const upload = multer({ dest: "uploads/" });

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
  updateDesign
);

router.delete("/:id", protect, deleteDesign);

export default router;
