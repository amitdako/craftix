const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options(/(.*)/, cors());
app.use(express.json());

//Access to media.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//MongoDB Connection ---
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/craftix";

mongoose
  .connect(mongoURI)
  .then(() => {
    const dbType = process.env.MONGO_URI ? "Atlas (Cloud)" : "Localhost";
    console.log(`Connected to MongoDB ${dbType}`);
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB", err);
    process.exit(1);
  });

// Routes
const postRoutes = require("./routes/posts");
const userRoutes = require("./routes/users");

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Craftix API is running smoothly!");
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
    message = "Email already exists.";
  }

  console.error(`[Error] ${statusCode} - ${message}`);
  res.status(statusCode).json({ status: "error", message });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
