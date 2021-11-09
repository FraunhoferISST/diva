const express = require("express");
const ServicesController = require("../controllers/ServicesController");

const router = express.Router();

router.get("/", ServicesController.getServices);
router.get("/:id", ServicesController.getService);
router.post("/", ServicesController.createService);
router.patch("/:id", ServicesController.patchService);
router.delete("/:id", ServicesController.deleteService);

module.exports = router;
