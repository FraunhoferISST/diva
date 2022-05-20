const express = require("express");
const policiesController = require("../controllers/PoliciesController");

const router = express.Router();

router.post("/enforcePolicies", policiesController.enforcePolicies);

module.exports = router;
