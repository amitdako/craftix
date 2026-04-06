const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

// The url will be/api/ai/translate
router.post("/translate", aiController.translateProject);

module.exports = router;
