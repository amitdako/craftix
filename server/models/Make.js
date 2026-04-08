const mongoose = require("mongoose");

const makeSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, maxLength: 500 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    {
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      createdAt: { type: Date, default: Date.now },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Make", makeSchema);
