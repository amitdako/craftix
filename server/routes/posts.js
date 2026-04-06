const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");
const { S3Client } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const upload = require("../middleware/upload");
//saving files.

//Making new post.
router.post("/", auth, upload.single("media"), async (req, res, next) => {
  try {
    const postData = {
      ...req.body,
      author: req.user.id,
    };

    if (req.file) {
      // בדיקה האם אנחנו ב-Production (AWS) או ב-Development (Local)
      const isProduction = process.env.NODE_ENV === "production";

      postData.mediaUrl = isProduction
        ? req.file.location // ב-AWS: הקישור המלא ל-S3
        : `/uploads/posts/${req.file.filename}`; // במחשב: נתיב יחסי לתיקייה המקומית

      postData.mediaType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";

      console.log("Saving mediaUrl:", postData.mediaUrl); // להדפסה בטרמינל כדי לוודא שזה עובד
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

// Get posts with search/catagory or without.
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
      .populate("author", "displayName profileImage")
      .populate({
        path: "comments.author",
        select: "displayName profileImage",
      })
      .populate({
        path: "parentPost",
        populate: {
          path: "author",
          select: "displayName profileImage",
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

// my profile.
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

// add comment
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

// delete comment
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

// like/unlike comment
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

// like/unlike post
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

// getting posts of other profile
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
//Edit post
router.put("/:id", auth, upload.single("media"), async (req, res, next) => {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this post" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    post.postType = req.body.postType || post.postType;

    if (
      req.body.projectDetails &&
      typeof req.body.projectDetails === "string"
    ) {
      post.projectDetails = JSON.parse(req.body.projectDetails);
    }

    if (req.file) {
      const isProduction = process.env.NODE_ENV === "production";
      post.mediaUrl = isProduction
        ? req.file.location
        : `/uploads/posts/${req.file.filename}`;

      post.mediaType = req.file.mimetype.startsWith("video")
        ? "video"
        : "image";
    } else if (req.body.removeMedia === "true") {
      // המשתמש בחר למחוק את המדיה הקיימת מבלי להעלות חדשה
      post.mediaUrl = null;
      post.mediaType = null;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error("Error updating post:", err);
    next(err);
  }
});
// saving/unsaving post
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

//new i made it post
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
        category: originalPost.category,
      });

      if (req.file) {
        sharePost.mediaUrl = req.file.location;
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

// delete post
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
