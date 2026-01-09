const express = require("express");
const upload = require("../config/multer");
const crypto = require("crypto");

const router = express.Router();

// In-memory store: downloadId -> filename
// (Later you can replace this with DB)
const fileStore = global.fileStore || new Map();
global.fileStore = fileStore;

// Upload endpoint
router.post("/", upload.single("file"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    // Generate random download ID
    const downloadId = crypto.randomUUID();

    // Store mapping
    fileStore.set(downloadId, req.file.filename);

    // Dynamically get base URL (works on Render & local)
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    res.json({
        message: "File uploaded successfully",
        downloadLink: `${baseUrl}/download/${downloadId}`
    });
});

module.exports = router;
