const express = require("express");

const AssetImagesController = require("../controllers/AssetImagesController");

const router = express.Router();

router.get("/:id", AssetImagesController.getImage);
router.post("/", AssetImagesController.addImage);
router.put("/:id", AssetImagesController.putImage);
router.delete("/:id", AssetImagesController.deleteImage);

module.exports = router;
