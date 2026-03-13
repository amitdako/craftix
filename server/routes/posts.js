const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// הגדרות אחסון לקבצים (Multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // מגבלה של 50MB
});

// יצירת פוסט חדש (פרויקט או פוסט רגיל)
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

// שליפת כל הפוסטים (פיד ראשי) עם חיפוש ו-Double Populate
router.get("/", async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    console.log("Final MongoDB Query:", JSON.stringify(query));

    const posts = await Post.find(query)
      .populate("author", "displayName profileImage") // יוצר הפוסט הנוכחי
      .populate({
        path: "comments.author",
        select: "displayName profileImage", // יוצרי התגובות
      })
      .populate({
        path: "parentPost", // הפרויקט המקורי (במידה וזה שיתוף)
        populate: {
          path: "author",
          select: "displayName profileImage", // יוצר הפרויקט המקורי - Populate כפול!
        },
      })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`Found ${posts.length} posts.`);
    res.json(posts);
  } catch (err) {
    console.error("Error in GET /posts:", err);
    next(err);
  }
});

// שליפת פוסטים של המשתמש המחובר (הפרופיל שלי)
router.get("/my-posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.id })
      .populate("author", "displayName profileImage")
      .populate({
        path: "comments.author",
        select: "displayName profileImage",
      })
      .populate({
        path: "parentPost",
        populate: { path: "author", select: "displayName profileImage" },
      })
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching your posts" });
  }
});

// הוספת תגובה לפוסט
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

    const updatedPost = await Post.findById(post._id).populate(
      "comments.author",
      "displayName profileImage",
    );
    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// מחיקת תגובה
router.delete("/:postId/comment/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    post.comments.pull(req.params.commentId);
    await post.save();

    const updatedPost = await Post.findById(req.params.postId).populate(
      "comments.author",
      "displayName profileImage",
    );

    res.json(updatedPost.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// לייק/ביטול לייק לתגובה ספציפית
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

// לייק/ביטול לייק לפוסט
router.post("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.includes(req.user.id);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json({ likes: post.likes, isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//reciving specific post.
router.get("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "displayName profileImage") // היוצר של הפוסט הנוכחי
      .populate({
        path: "comments.author",
        select: "displayName profileImage", // יוצרי התגובות
      })
      .populate({
        path: "parentPost", // הפרויקט המקורי (במידה וזה שיתוף)
        populate: {
          path: "author",
          select: "displayName profileImage", // יוצר הפרויקט המקורי
        },
      });

    if (!post) {
      return res.status(404).json({ message: "פוסט לא נמצא" });
    }

    res.json(post);
  } catch (err) {
    console.error("Error fetching single post:", err);
    next(err);
  }
});

// שליפת פוסטים של משתמש ספציפי (לפרופיל) עם חיפוש
router.get("/user/:userId", async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.params.userId;

    let query = { author: userId };

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
      .populate({
        path: "parentPost",
        populate: { path: "author", select: "displayName profileImage" },
      })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// שמירה או ביטול שמירה של פוסט
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

// יצירת פוסט "ביצעתי את זה" (שיתוף פרויקט)
router.post(
  "/:id/share-made-this",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("Share request received for post:", req.params.id);

      const originalPost = await Post.findById(req.params.id);
      if (!originalPost) {
        return res.status(404).json({ message: "Original project not found" });
      }

      const sharePost = new Post({
        content: req.body.comment,
        author: req.user.id,
        postType: "implementation",
        parentPost: req.params.id,
        category: originalPost.category, // ירושה אוטומטית של הקטגוריה מהמקור
      });

      if (req.file) {
        sharePost.mediaUrl = `/uploads/${req.file.filename}`;
        sharePost.mediaType = "image";
      }

      const savedPost = await sharePost.save();
      console.log("Successfully saved shared post!");

      const populatedPost = await Post.findById(savedPost._id)
        .populate("author", "displayName profileImage")
        .populate({
          path: "parentPost",
          populate: { path: "author", select: "displayName profileImage" },
        });

      res.status(201).json(populatedPost);
    } catch (err) {
      console.error("ERROR IN SHARE-MADE-THIS:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
);

// מחיקת פוסט
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
