const express = require("express");
const ProfilingController = require("../controllers/ProfilingController");

const router = express.Router();

router.post("/exists", ProfilingController.existProfiling);
router.post("/run", ProfilingController.runProfiling);
router.post("/run/:dag", ProfilingController.runDag);

module.exports = router;
