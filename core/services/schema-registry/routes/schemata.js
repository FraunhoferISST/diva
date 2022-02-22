const express = require("express");
const { logger: log } = require("@diva/common/logger");
const schemaService = require("../services/SchemaService");

const router = express.Router();

router.get("/schemata/:name", async (req, res, next) => {
  try {
    const schema = await schemaService.getByName(req.params.name);
    res.setHeader("Content-Type", schema.mimeType);
    res.status(200).send(schema.payload);
    log.info(`📬 send schema "${req.params.name}"`);
  } catch (e) {
    next(e);
  }
});

router.get("/resolvedSchemata/:name", async (req, res, next) => {
  try {
    const resolvedSchema = schemaService.getResolvedByName(req.params.name);
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(resolvedSchema);
    log.info(`📬 send schema "${req.params.name}"`);
  } catch (e) {
    next(e);
  }
});

router.get("/esmappings", async (req, res, next) => {
  try {
    const mappings = schemaService.getESMappings();
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(mappings);
    log.info(`📬 send ES mappings`);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
