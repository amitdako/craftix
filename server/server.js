const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

// --- 1. הגדרת CORS חסינה ---
app.use(
  cors({
    origin: true, // מאפשר ל-Vercel ולכל מקור אחר
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// הוספת טיפול מפורש בבקשות OPTIONS (Preflight) לכל הנתיבים
// זה מה שיפתור את ה-404 על ה-OPTIONS
app.options("*", cors());

app.use(express.json());

// --- 2. גישה לתמונות ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/craftix")
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

// שימוש בנתבים
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Craftix API is running smoothly on Render!");
});

const PORT = process.env.PORT || 5000;

// Global error handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }
  if (err.code === 11000) {
    statusCode = 409;
    message = "Email already exists. Please use a different one.";
  }

  console.error(`[Error] ${statusCode} - ${message}`);
  res.status(statusCode).json({
    status: "error",
    message: message,
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
