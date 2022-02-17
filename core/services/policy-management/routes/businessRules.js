const express = require("express");
const businessRulesController = require("../controllers/BusinessRulesController");

const router = express.Router();

router.post("/actions", businessRulesController.requestRulesActions);

module.exports = router;
