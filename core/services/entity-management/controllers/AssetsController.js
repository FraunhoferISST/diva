const messageProducer = require("@diva/common/messaging/MessageProducer");
const assetService = require("../services/AssetService");
const EntityController = require("./EntityController");

const createSingleAsset = async (asset, actorId) => {
  const newAssetId = await assetService.create(asset, actorId);
  messageProducer.produce(newAssetId, actorId, "create");
  return newAssetId;
};

const appendBulkRequestPromiseHandler = (promise, additionalData) =>
  promise
    .then((id) => ({
      statusCode: 201,
      data: id,
    }))
    .catch((err) => ({
      statusCode: err.code || 500,
      data: additionalData,
      error: err,
    }));

const processCreateBulkRequest = async (bulk, actorid) =>
  Promise.all(
    bulk.map((asset) =>
      appendBulkRequestPromiseHandler(
        createSingleAsset(asset, actorid),
        asset.uniqueFingerprint
      )
    )
  );

class AssetsController extends EntityController {
  async create(req, res, next) {
    try {
      const actorid = req.headers["x-actorid"];
      if (Array.isArray(req.body)) {
        const result = await processCreateBulkRequest(req.body, actorid);
        res.status(207).send(result);
      } else {
        const result = await createSingleAsset(req.body, actorid);
        res.status(201).send(result);
      }
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AssetsController(assetService);
