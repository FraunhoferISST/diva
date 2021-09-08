const assetImagesService = require("../services/AssetImagesService");
const { catchHandler } = require("../utils/errors");

class AssetImagesController {
  addImage(req, res, next) {
    catchHandler(async () => {
      const id = await assetImagesService.addImage(req.file);
      res.status(201).send(id);
    }, next);
  }

  getImage(req, res, next) {
    catchHandler(async () => {
      const { stream, contentType } = await assetImagesService.getImage(
        req.params.id
      );
      res.header("Content-Type", contentType);
      stream.pipe(res);
    }, next);
  }

  putImage(req, res, next) {
    catchHandler(async () => {
      const id = await assetImagesService.putImage(req.params.id, req.file);
      res.status(201).send(id);
    }, next);
  }

  deleteImage(req, res, next) {
    catchHandler(async () => {
      await assetImagesService.deleteImage(req.params.id);
      res.status(200).send();
    }, next);
  }
}

module.exports = new AssetImagesController();
