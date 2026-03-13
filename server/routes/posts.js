const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
//we will save in this folder with this name.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
// Wherw we will save the files and what are the limits.
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

//creating new post
router.post("/", auth, upload.single("media"), async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id,
    };

    if (req.file) {
      postData.mediaUrl = `/uploads/${req.file.filename}`;
      postData.mediaType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
    }

    if (
      postData.projectDetails &&
      typeof postData.projectDetails === "string"
    ) {
      postData.projectDetails = JSON.parse(postData.projectDetails);
    }

    const post = new Post(postData);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (err) {
    next(err);
  }
});

// search by word/catagory.
router.get("/", async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    //searching by catagory.
    if (category && category !== "All") {
      query.category = category;
    }

    // search by words.
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    console.log("Final MongoDB Query:", JSON.stringify(query));

    const posts = await Post.find(query)
      .populate("author", "displayName profileImage")
      .populate({
        path: "comments.author",
        select: "displayName profileImage",
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${posts.length} posts.`);
    res.json(posts);
  } catch (err) {
    next(err);
  }
});
// my profile
router.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "displayName profileImage")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
});

//Add a comment to a post
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const newComment = {
      author: req.user.id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    // Populate author info before sending back
    const updatedPost = await Post.findById(post._id).populate(
      "comments.author",
      "displayName profileImage",
    );
    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a comment
router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // --- Ownership Check ---
    // Only the comment author can delete it
    if (comment.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    // Remove the comment from the array
    post.comments.pull(req.params.commentId);
    await post.save();

    // Return the updated comments list (populated)
    const updatedPost = await Post.findById(req.params.postId).populate(
      "comments.author",
      "displayName profileImage",
    );

    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Like/Unlike a specific comment
router.post("/:postId/comment/:commentId/like", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    const comment = post.comments.id(req.params.commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== req.user.id,
      );
    } else {
      comment.likes.push(req.user.id);
    }

    await post.save();

    // --- התיקון הקריטי כאן ---
    // אנחנו טוענים מחדש את הפוסט עם פרטי המשתמשים בתגובות לפני השליחה
    const updatedPost = await Post.findById(req.params.postId).populate(
      "comments.author",
      "displayName profileImage",
    );

    res.json(updatedPost.comments);
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ message: "Server error" });
  }
});
// Like / Unlike a post
router.post("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Check if the user already liked the post
    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      // Unlike: Remove user ID from likes array
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      // Like: Add user ID to likes array
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Get posts for a specific user with optional search
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.params.userId;

    // Start with the basic filter: only posts from this user
    let query = { author: userId };

    // If there's a search term, add the regex search logic
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .populate("author", "displayName profileImage fullName")
      .populate({
        path: "comments.author",
        select: "displayName profileImage",
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

//save or unsave post.
router.post("/save/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.savedPosts) {
      user.savedPosts = [];
    }

    const postId = req.params.id;
    const isSaved = user.savedPosts.some((id) => id.toString() === postId);

    if (isSaved) {
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId,
      );
    } else {
      user.savedPosts.push(postId);
    }

    await user.save();
    res.json({
      message: isSaved ? "Removed from saved" : "Saved successfully",
      savedPosts: user.savedPosts,
    });
  } catch (err) {
    console.error("Backend Error in /save/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//delete post
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await post.deleteOne();
    res.json({ message: "Removed successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
