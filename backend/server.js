import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import designRoutes from "./routes/designRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();

// Connect DB
connectDB();

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:8080",
      "http://localhost:5173",
      "https://mattyai-2-0-drab.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.json({ success: true, message: "Matty Backend is running 🚀" });
});
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);

// Static uploads (optional local preview, not for production)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  await mongoose.connection.close();
  server.close(() => process.exit(0));
});

