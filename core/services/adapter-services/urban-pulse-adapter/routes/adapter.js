const express = require("express");
const UrbanPulseService = require("../services/UrbanPulseService");

const router = express.Router();

router.post("/import", async (req, res, next) => {
  try {
    const { createAsset, assetId, streamResponse } = req.query;
    const result = await UrbanPulseService.import(
      req.body,
      req.headers["x-actorid"],
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

router.post("/asset", async (req, res, next) => {
  try {
    const result = await UrbanPulseService.createAsset(
      req.body,
      req.headers["x-actorid"]
    );
    res.status(201).send(result);
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
