const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

// --- 1. תיקון ה-CORS שיהיה גמיש ---
const allowedOrigins = [
  "http://localhost:5173", // פיתוח מקומי
  "https://craftix-green.vercel.app", // הכתובת הציבורית שלך ב-Vercel
];

app.use(
  cors({
    origin: function (origin, callback) {
      // מאפשר בקשות בלי origin (כמו Postman או סלולר) או כאלו שברשימה
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// --- 2. תיקון הגישה לתמונות בשרת ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/craftix")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

// שימוש בנתבים עם קידומת /api
// וודא שב-Vercel ה-VITE_API_URL מסתיים ב- /api
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Root test route - עוזר לבדוק שהשרת חי
app.get("/", (req, res) => {
  res.send("Craftix API is running...");
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
