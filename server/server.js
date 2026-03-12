const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // הפורט שבו ה-Vite שלך רץ
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/craftix")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

// שימוש בנתבים
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

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
