import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, email, password } = req.body;

  try {
    const normalizedEmail=email.toLowerCase().trim();
    const exists = await User.findOne({ email:normalizedEmail });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, passwordHash: hashed });

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const normalizedEmail=email.toLowerCase().trim();
    const user = await User.findOne({ email:normalizedEmail });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    res.json({
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const { _id, username, email, role, createdAt, updatedAt } = user;
    return res.json({ success: true, user: { id: _id, username, email, role, createdAt, updatedAt } });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
