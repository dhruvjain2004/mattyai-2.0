
import mongoose from "mongoose";

const designSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, default: "Untitled" },
    jsonData: { type: Object, default: {} },
    thumbnailUrl: { type: String, default: "" },
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: false },
    version: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Design", designSchema);
