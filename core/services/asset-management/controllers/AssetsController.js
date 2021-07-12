const assetService = require("../services/AssetService");
const messageProducer = require("../messageProducer/producer");

const createSingleAsset = async (asset, actorId) => {
  const newAssetId = await assetService.createAsset(asset, actorId);
  messageProducer.produce(newAssetId, actorId, "create");
  return newAssetId;
};

const linkSingleEntity = async (assetId, entityId, actorid) =>
  assetService
    .linkEntity(assetId, entityId, actorid)
    .then(() => messageProducer.produce(assetId, actorid, "update"))
    .then(() => entityId);

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

const processLinkBulkRequest = async (bulk, assetId, actorid) =>
  Promise.all(
    bulk.map(({ entityId }) =>
      appendBulkRequestPromiseHandler(
        linkSingleEntity(assetId, entityId, actorid),
        entityId
      )
    )
  );

class AssetsController {
  async getAssets(req, res, next) {
    try {
      const result = await assetService.getAssets(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getAsset(req, res, next) {
    try {
      const result = await assetService.getAssetById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async createAsset(req, res, next) {
    try {
      const { actorid } = req;
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

  async updateAsset(req, res, next) {
    try {
      const { id } = req.params;
      await assetService.updateAsset(id, req.body, req.actorid);
      res.send();
      messageProducer.produce(id, req.actorid, "update");
    } catch (err) {
      return next(err);
    }
  }

  async patchAsset(req, res, next) {
    try {
      const { id } = req.params;
      await assetService.patchAsset(id, req.body, req.actorid);
      res.send();
      messageProducer.produce(id, req.actorid, "update");
    } catch (err) {
      return next(err);
    }
  }

  async deleteAsset(req, res, next) {
    try {
      const { id } = req.params;
      await assetService.deleteAsset(id);
      res.send();
      messageProducer.produce(id, req.actorid, "delete");
    } catch (err) {
      return next(err);
    }
  }

  async linkEntity(req, res, next) {
    try {
      const { actorid } = req;
      const { id } = req.params;
      if (Array.isArray(req.body)) {
        const result = await processLinkBulkRequest(req.body, id, actorid);
        res.status(207).send(result);
      } else {
        await linkSingleEntity(id, req.body.entityId, actorid);
        res.status(201).send();
      }
    } catch (err) {
      return next(err);
    }
  }

  async getLinkedEntities(req, res, next) {
    try {
      const result = await assetService.getLinkedEntities(
        req.params.id,
        req.query
      );
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async unlinkEntity(req, res, next) {
    try {
      const { id, entityId } = req.params;
      await assetService.unlinkEntity(id, entityId, req.actorid);
      res.send();
      messageProducer.produce(id, req.actorid, "update");
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AssetsController();
