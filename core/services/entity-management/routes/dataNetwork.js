const express = require("express");
const dataNetworkController = require("../controllers/DataNetworkController");

const router = express.Router();

router.get("/edges", dataNetworkController.getEdges);
router.get("/edges/:id", dataNetworkController.getEdgeById);
router.post("/edges", dataNetworkController.createEdge);
router.patch("/edges/:id", dataNetworkController.patchEdge);
router.post("/edges/:id", dataNetworkController.patchEdge);
router.delete("/edges/:id", dataNetworkController.deleteEdgeById);

router.get("/nodes/:id", dataNetworkController.getNodeById);
/* router.put("/nodes", dataNetworkController.createNode);
router.delete("/nodes/:id", dataNetworkController.deleteNodeById); */

module.exports = router;
