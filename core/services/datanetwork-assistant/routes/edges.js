const express = require("express");
const DatanetworkController = require("../controllers/DatanetworkController");

const router = express.Router();

router.get("/edges", DatanetworkController.getEdges);
router.get("/edges/:id", DatanetworkController.getEdge);
router.put("/edges", DatanetworkController.putEdge);
router.delete("/edges", DatanetworkController.deleteEdge);

module.exports = router;
