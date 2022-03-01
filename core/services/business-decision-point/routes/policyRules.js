const express = require("express");
const policyRulesController = require("../controllers/PolicyRulesController");

const router = express.Router();

router.post("/enforcePolicies", policyRulesController.enforcePolicies);

module.exports = router;
