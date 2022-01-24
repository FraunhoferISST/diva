const express = require("express");
const AssetsController = require("../controllers/AssetsController");

const router = express.Router();

router.get("/", AssetsController.getAssets);
router.get("/:id", AssetsController.getAsset);
router.post("/", AssetsController.createAsset);
router.patch("/:id", AssetsController.patchAsset);
router.post("/:id", AssetsController.patchAsset);
router.delete("/:id", AssetsController.deleteAsset);
router.put("/:id/entities", AssetsController.linkEntity);
router.get("/:id/entities", AssetsController.getLinkedEntities);
router.delete("/:id/entities/:entityId", AssetsController.unlinkEntity);

module.exports = router;
