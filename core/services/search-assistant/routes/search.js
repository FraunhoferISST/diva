const express = require("express");
const searchController = require("../controllers/SearchController");

const router = express.Router();

router.get("/", searchController.searchAll);

module.exports = router;
