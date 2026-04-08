const express = require("express");
const router = express.Router();
const Make = require("../models/Make");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

// upload new flow
router.post("/", auth, upload.single("media"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "נא להעלות וידאו" });

    const isProduction = process.env.NODE_ENV === "production";
    const videoUrl = isProduction
      ? req.file.location
      : `/uploads/posts/${req.file.filename}`;

    const newMake = new Make({
      videoUrl,
      author: req.user.id,
      description: req.body.description,
    });

    const savedMake = await newMake.save();
    res.status(201).json(savedMake);
  } catch (err) {
    next(err);
  }
});

// getting flowes in random order
router.get("/", async (req, res, next) => {
  try {
    const randomMakes = await Make.aggregate([
      { $sample: { size: 10 } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo",
        },
      },
      { $unwind: "$authorInfo" },
    ]);

    const formattedMakes = randomMakes.map((make) => ({
      ...make,
      author: {
        _id: make.authorInfo._id,
        displayName: make.authorInfo.displayName,
        profileImage: make.authorInfo.profileImage,
      },
    }));

    res.json(formattedMakes);
  } catch (err) {
    next(err);
  }
});

//like/unlike
router.post("/like/:id", auth, async (req, res) => {
  try {
    const make = await Make.findById(req.params.id);
    if (!make) return res.status(404).json({ message: "Make not found" });

    const isLiked = make.likes.includes(req.user.id);
    if (isLiked) {
      make.likes = make.likes.filter((id) => id.toString() !== req.user.id);
    } else {
      make.likes.push(req.user.id);
    }

    await make.save();
    res.json({ likes: make.likes, isLiked: !isLiked });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//get all comments of flow
router.get("/:id/comments", async (req, res) => {
  try {
    const make = await Make.findById(req.params.id).populate(
      "comments.author",
      "displayName profileImage",
    );
    if (!make) return res.status(404).json({ message: "Make not found" });
    res.json(make.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//new comment
router.post("/:id/comment", auth, async (req, res) => {
  try {
    const make = await Make.findById(req.params.id);
    if (!make) return res.status(404).json({ message: "Make not found" });

    const newComment = {
      author: req.user.id,
      text: req.body.text,
    };

    make.comments.unshift(newComment);
    await make.save();

    const populatedMake = await Make.findById(make._id).populate(
      "comments.author",
      "displayName profileImage",
    );
    res.json(populatedMake.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
//like/unlike for comment
router.post("/:id/comment/:commentId/like", auth, async (req, res) => {
  try {
    const make = await Make.findById(req.params.id).populate(
      "comments.author",
      "displayName profileImage",
    );
    if (!make) return res.status(404).json({ message: "Make not found" });

    const comment = make.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (!comment.likes) comment.likes = [];

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== req.user.id,
      );
    } else {
      comment.likes.push(req.user.id);
    }

    await make.save();
    res.json(make.comments);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// delete comment
router.delete("/:id/comment/:commentId", auth, async (req, res) => {
  try {
    const make = await Make.findById(req.params.id);
    if (!make) return res.status(404).json({ message: "Make not found" });

    const comment = make.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    //checking that he is the owner
    if (comment.author.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    make.comments.pull(req.params.commentId);
    await make.save();

    const populatedMake = await Make.findById(make._id).populate(
      "comments.author",
      "displayName profileImage",
    );
    res.json(populatedMake.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
