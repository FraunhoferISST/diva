const express = require("express");

const dscController = require("../controllers/dscController");

const router = express.Router();

router.post("/:id/offers", dscController.createOffer);
router.put("/:id/offers/:offerId", dscController.updateOffer);
router.get("/:id/offers/:offerId", dscController.getOffer);
router.delete("/:id/offers/:offerId", dscController.deleteOffer);

module.exports = router;
