const express = require("express");

const reviewsController = require("../controllers/ReviewsController");

const router = express.Router();

router.post("/", reviewsController.createReview);
router.get("/", reviewsController.getReviews);
router.get("/:id", reviewsController.getReview);
router.patch("/:id", reviewsController.patchReview);
router.post("/:id", reviewsController.patchReview);
router.delete("/:id", reviewsController.deleteReview);

module.exports = router;
