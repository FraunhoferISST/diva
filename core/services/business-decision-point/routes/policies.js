const express = require("express");
const policiesRulesController = require("../controllers/PoliciesController");

const router = express.Router();

router.post("/enforcePolicies", policiesRulesController.enforcePolicies);

module.exports = router;
