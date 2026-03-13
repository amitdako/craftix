const executionSchema = new mongoose.Schema({
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true }, // התמונה של הרהיט שהם בנו
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const Execution = mongoose.model("Execution", executionSchema);
