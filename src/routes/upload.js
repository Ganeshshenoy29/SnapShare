const express = require("express");
const upload = require("../config/multer");
const crypto = require("crypto");

const router = express.Router();

// Shared in-memory store
const fileStore = global.fileStore || new Map();
global.fileStore = fileStore;

router.post("/", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const downloadId = crypto.randomUUID();
    fileStore.set(downloadId, req.file.filename);

    const baseUrl = `${req.protocol}://${req.get("host")}`;

    // 🔥 IMPORTANT: link goes to frontend page
    res.json({
        message: "File uploaded successfully",
        shareLink: `${baseUrl}/file/${downloadId}`
    });
});

module.exports = router;
