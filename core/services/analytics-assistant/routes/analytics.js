const express = require("express");

const AnalyticsController = require("../controllers/AnalyticsController");

const router = express.Router();

/* Global Metrics */
router.get("/distributionOfEntities", AnalyticsController.entityDistribution);

/* Resource Metrics */
router.get(
  "/distributionOfResourceTypes",
  AnalyticsController.resourceTypeDistribution
);
router.get(
  "/distributionOfResourceMimeTypes",
  AnalyticsController.resourceMimeTypeDistribution
);
router.get("/entities/:id/reviews", AnalyticsController.getReviewsStats);

module.exports = router;
