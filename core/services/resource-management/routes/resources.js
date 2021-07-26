const express = require("express");
const ResourcesController = require("../controllers/Resources");

const router = express.Router();

router.get("/", ResourcesController.getResources);
router.get("/:id", ResourcesController.getResource);
router.post("/", ResourcesController.createResource);
router.patch("/:id", ResourcesController.patchResource);
router.delete("/:id", ResourcesController.deleteResource);

module.exports = router;
