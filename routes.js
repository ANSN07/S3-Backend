const express = require("express");
const router = express.Router();
const downloadController = require("./download");
const uploadController = require("./upload");
const encryptController = require("./encrypt");

router.get("/:id/download", downloadController.downloadFile);
router.get("/:id/upload", uploadController.uploadFile);
router.get("/:id/encrypt", encryptController.encryptFile);
module.exports = router;
