const express = require("express");
const DatanetworkController = require("../controllers/DatanetworkController");

const router = express.Router();

router.get("/edges", DatanetworkController.getEdges);
router.get("/edges/:id", DatanetworkController.getEdgeById);
router.put("/edges", DatanetworkController.putEdge);
router.delete("/edges/:id", DatanetworkController.deleteEdgeById);

module.exports = router;
