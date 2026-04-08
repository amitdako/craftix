const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
//handling upload of media.
const s3 = new S3Client({ region: "eu-central-1" });
const isProduction = process.env.NODE_ENV === "production";

const storage = isProduction
  ? multerS3({
      s3: s3,
      bucket: "craftix-files-amit-2024",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const folder = req.baseUrl.includes("users") ? "profiles" : "posts";
        cb(null, `${folder}/${Date.now()}${path.extname(file.originalname)}`);
      },
    })
  : multer.diskStorage({
      destination: function (req, file, cb) {
        const folder = req.baseUrl.includes("users")
          ? "uploads/profiles/"
          : "uploads/posts/";
        cb(null, folder);
      },
      filename: function (req, file, cb) {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`);
      },
    });

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
