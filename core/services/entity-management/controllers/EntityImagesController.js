const entityMediaService = require("../services/EntityImagesService");
const { catchHandler } = require("../utils/errors");

class EntityImagesController {
  getById(req, res, next) {
    catchHandler(async () => {
      const { stream, contentType } = await entityMediaService.getImageById(
        req.params.id
      );
      res.header("Content-Type", contentType);
      stream.pipe(res);
    }, next);
  }

  put(req, res, next) {
    catchHandler(async () => {
      const id = await entityMediaService.addImage(req.params.id, req.file);
      res.status(201).send(id);
    }, next);
  }

  deleteById(req, res, next) {
    catchHandler(async () => {
      await entityMediaService.deleteImageById(req.params.id);
      res.status(200).send();
    }, next);
  }
}

module.exports = new EntityImagesController();
