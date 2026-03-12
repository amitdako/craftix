const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");

//creating new folder if there isn't
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
//we will save in this folder with this name.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Register
router.post("/register", async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "Success",
      user: {
        id: savedUser._id,
        displayName: savedUser.displayName,
        email: savedUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Wrong Email or Password" });
    }
    const token = await user.generateToken();
    res.json({
      token,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        savedPosts: user.savedPosts || [],
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    next(err);
  }
});
// search users
router.get("/search", async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    const users = await User.find({
      $or: [
        { displayName: { $regex: q, $options: "i" } },
        { fullName: { $regex: q, $options: "i" } },
      ],
    })
      .select("displayName fullName profileImage _id")
      .limit(5);

    res.json(users);
  } catch (err) {
    next(err);
  }
});
// Get Saved Posts
router.get("/saved-posts", auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "savedPosts",
      populate: { path: "author", select: "displayName fullName profileImage" },
    });
    res.json(user.savedPosts);
  } catch (err) {
    next(err);
  }
});

// Upload Avatar
router.post(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No file" });
      const user = await User.findById(req.user.id);
      user.profileImage = `/uploads/${req.file.filename}`;
      await user.save();
      res.json({ message: "Updated", profileImage: user.profileImage });
    } catch (err) {
      res.status(500).json({ message: "Error" });
    }
  },
);

//logout
router.post("/logout", auth, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
    await req.user.save();
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
});

// Get user profile
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password -tokens");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
