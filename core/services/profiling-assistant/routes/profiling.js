const express = require("express");
const ProfilingController = require("../controllers/ProfilingController");

const router = express.Router();

router.post("/exists", ProfilingController.existProfiling);
router.post("/run", ProfilingController.runProfiling);

module.exports = router;
