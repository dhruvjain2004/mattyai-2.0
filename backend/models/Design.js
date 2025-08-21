import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled", trim: true, maxlength: 100 },
    jsonData: { type: Object, default: {} },
    thumbnailUrl: { type: String, default: "" },
    thumbnailPublicId: { type: String, default: "" }, // Cloudinary public_id for cleanup
    exportedImageUrl: { type: String, default: "" },
    exportedImagePublicId: { type: String, default: "" },
    tags: [{ type: String, trim: true }],
    isPublic: { type: Boolean, default: false },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

// Indexes for faster queries
designSchema.index({ userId: 1, updatedAt: -1 });
designSchema.index({ tags: 1 });

export default mongoose.model("Design", designSchema);

