const express = require("express");
const SearchController = require("../controllers/SearchController");

const router = express.Router();

router.get("/", SearchController.searchAll);

module.exports = router;
