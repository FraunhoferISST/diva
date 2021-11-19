const express = require("express");
const DatanetworkController = require("../controllers/DatanetworkController");

const router = express.Router();

router.get("/edges/:id", DatanetworkController.getEdges);
router.put("/edges", DatanetworkController.putEdge);
router.delete("/edges", DatanetworkController.deleteEdge);

module.exports = router;
