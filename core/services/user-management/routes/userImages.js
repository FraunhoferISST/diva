const express = require("express");

const UserImagesController = require("../controllers/UserImagesController");

const router = express.Router();

router.get("/:id", UserImagesController.getImage);
router.post("/", UserImagesController.addImage);
router.put("/:id", UserImagesController.putImage);
router.delete("/:id", UserImagesController.deleteImage);

module.exports = router;
