const express = require("express");
const PolicyDecisionController = require("../controllers/policyDecisionController");

const router = express.Router();

router.post("//", PolicyDecisionController.requestDecision);

module.exports = router;
