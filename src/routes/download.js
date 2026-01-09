const express = require("express");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const fileStore = global.fileStore;

router.get("/:id", (req, res) => {

    const id = req.params.id;
    const filename = fileStore.get(id);

    if (!filename) {
        return res.status(404).send("Invalid or expired link");
    }

    const filePath = path.join(__dirname, "..", "..", "uploads", filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send("File not found");
    }

    res.download(filePath);
});

module.exports = router;
