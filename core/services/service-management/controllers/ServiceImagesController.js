const serviceImagesService = require("../services/ServiceImagesService");
const { catchHandler } = require("../utils/errors");

class ServiceImagesController {
  addImage(req, res, next) {
    catchHandler(async () => {
      const id = await serviceImagesService.addImage(req.file);
      res.status(201).send(id);
    }, next);
  }

  getImage(req, res, next) {
    catchHandler(async () => {
      const { stream, contentType } = await serviceImagesService.getImage(
        req.params.id
      );
      res.header("Content-Type", contentType);
      stream.pipe(res);
    }, next);
  }

  putImage(req, res, next) {
    catchHandler(async () => {
      const id = await serviceImagesService.putImage(req.params.id, req.file);
      res.status(201).send(id);
    }, next);
  }

  deleteImage(req, res, next) {
    catchHandler(async () => {
      await serviceImagesService.deleteImage(req.params.id);
      res.status(200).send();
    }, next);
  }
}

module.exports = new ServiceImagesController();
