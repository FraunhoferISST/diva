const express = require("express");
const dataNetworkController = require("../controllers/DataNetworkController");

const router = express.Router();

router.get(
  "/edges",
  dataNetworkController.getEdges.bind(dataNetworkController)
);
router.get("/edges/:id", dataNetworkController.getEdgeById);
router.post(
  "/edges",
  dataNetworkController.createEdge.bind(dataNetworkController)
);
router.patch(
  "/edges/:id",
  dataNetworkController.patchEdge.bind(dataNetworkController)
);
router.post(
  "/edges/:id",
  dataNetworkController.patchEdge.bind(dataNetworkController)
);
router.delete(
  "/edges/:id",
  dataNetworkController.deleteEdgeById.bind(dataNetworkController)
);

router.get(
  "/nodes/:id",
  dataNetworkController.getNodeById.bind(dataNetworkController)
);
/* router.put("/nodes", dataNetworkController.createNode);
router.delete("/nodes/:id", dataNetworkController.deleteNodeById); */

module.exports = router;
