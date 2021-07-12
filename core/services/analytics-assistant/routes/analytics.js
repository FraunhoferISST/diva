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
router.get(
  "/resources/:resourceId/rating",
  AnalyticsController.resourceGetAvgRating
);

module.exports = router;
