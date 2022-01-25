const express = require("express");
const AssetsController = require("../controllers/AssetsController");

const router = express.Router();

router.get("/", AssetsController.getAssets);
router.get("/:id", AssetsController.getAsset);
router.post("/", AssetsController.createAsset);
router.patch("/:id", AssetsController.patchAsset);
router.delete("/:id", AssetsController.deleteAsset);

module.exports = router;
