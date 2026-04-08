const executionSchema = new mongoose.Schema({
  //for implamation post
  originalPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  image: { type: String, required: true }, // picture
  comment: String,
  createdAt: { type: Date, default: Date.now },
});

const Execution = mongoose.model("Execution", executionSchema);
