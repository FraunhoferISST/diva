const express = require("express");
const urbanPulseService = require("../services/UrbanPulseService");

const router = express.Router();

router.post("/import", async (req, res, next) => {
  try {
    const { createAsset, assetId, streamResponse } = req.query;
    const result = await urbanPulseService.import(
      req.body,
      req.headers.diva.actorId,
      streamResponse ? { req, res } : {},
      createAsset,
      assetId
    );
    if (streamResponse) {
      res.end();
    } else {
      res.status(207).send(result);
    }
  } catch (e) {
    return next(e?.response?.data || e);
  }
});

module.exports = router;
