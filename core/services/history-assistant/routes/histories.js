const express = require("express");

const historiesController = require("../controllers/HistoriesController");

const router = express.Router();

router.get("/", historiesController.getHistories);
router.get("/:id", historiesController.getHistory);

module.exports = router;
