const express = require("express");
const EntityController = require("../controllers/EntityController");
const EntityService = require("../services/EntityService");

const service = new EntityService("");
const controller = new EntityController(service);

const router = express.Router();

router.get("/entity", controller.get.bind(controller));
router.get("/entity/:id", controller.getById.bind(controller));
router.post("entity", controller.create.bind(controller));
router.patch("/entity/:id", controller.patchById.bind(controller));
router.post("/entity/:id", controller.patchById.bind(controller));
router.put("/entity/:id", controller.updateById.bind(controller));
router.delete("/entity/:id", controller.deleteById.bind(controller));
