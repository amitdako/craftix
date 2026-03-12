const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Likes for the comment
  createdAt: { type: Date, default: Date.now },
});
const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    postType: {
      type: String,
      enum: ["general", "project"],
      default: "general",
    },
    title: { type: String, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    mediaUrl: { type: String }, // Path to file on server
    mediaType: { type: String, enum: ["image", "video", null], default: null }, // Auto-detected type
    projectDetails: {
      difficulty: { type: Number, min: 1, max: 5 },
      tools: [String],
      materials: [String],
      steps: [
        {
          stepNumber: Number,
          description: String,
          timestamp: Number,
        },
      ],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [commentSchema],
  },
  { timestamps: true }, //saving time created and last update.
);
postSchema.index({ category: 1 }); // searching by category.
postSchema.index({ createdAt: -1 }); // searching from new to old.
postSchema.index({ title: "text", content: "text" });
module.exports = mongoose.model("Post", postSchema);
