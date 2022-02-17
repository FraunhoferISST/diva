const express = require("express");
const DatanetworkController = require("../controllers/DatanetworkController");

const router = express.Router();

router.get("/edges", DatanetworkController.getEdges);
router.get("/edges/:id", DatanetworkController.getEdgeById);
router.put("/edges", DatanetworkController.putEdge);
router.delete("/edges/:id", DatanetworkController.deleteEdgeById);

router.put("/nodes", DatanetworkController.putNode);
router.delete("/nodes/:id", DatanetworkController.deleteNodeById);

module.exports = router;
