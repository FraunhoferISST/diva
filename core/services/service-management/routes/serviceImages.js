const express = require("express");

const ServiceImagesController = require("../controllers/ServiceImagesController");

const router = express.Router();

router.get("/:id", ServiceImagesController.getImage);
router.post("/", ServiceImagesController.addImage);
router.put("/:id", ServiceImagesController.putImage);
router.delete("/:id", ServiceImagesController.deleteImage);

module.exports = router;
