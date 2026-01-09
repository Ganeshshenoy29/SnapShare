const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Use same in-memory store
const fileStore = global.fileStore;

router.get("/:id", (req, res) => {

    const downloadId = req.params.id;
    const filename = fileStore.get(downloadId);

    if (!filename) {
        return res.status(404).send("Invalid or expired download link");
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found on server");
    }

    // Force download
    res.download(filePath);
});

module.exports = router;
