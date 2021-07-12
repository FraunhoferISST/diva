const express = require("express");
const { getSchemaByName } = require("../db-keyv-engine");

const router = express.Router();

router.get("/:name", async (req, res, next) => {
  try {
    const schema = await getSchemaByName(req.params.name);
    res.setHeader("Content-Type", schema.mimeType);
    res.status(200).send(schema.payload);
    console.log(`📬 send schema "${req.params.name}"`);
  } catch (e) {
    console.error(`🛑 Could not get schema ${req.params.name}`, e);
    next(e);
  }
});

module.exports = router;
