import express from "express";
import { body, validationResult } from "express-validator";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Middleware for validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Register route
router.post(
  "/register",
  [
    body("username").isLength({ min: 2 }).withMessage("Username is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  validate,
  registerUser
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  loginUser
);

export default router;


