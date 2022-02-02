const userImagesService = require("../services/UserImagesService");
const { catchHandler } = require("../utils/errors");

class UserImagesController {
  addImage(req, res, next) {
    catchHandler(async () => {
      const id = await userImagesService.addImage(req.file);
      res.status(201).send(id);
    }, next);
  }

  getImage(req, res, next) {
    catchHandler(async () => {
      const { stream, contentType } = await userImagesService.getImage(
        req.params.id
      );
      res.header("Content-Type", contentType);
      stream.pipe(res);
    }, next);
  }

  putImage(req, res, next) {
    catchHandler(async () => {
      const id = await userImagesService.putImage(req.params.id, req.file);
      res.status(201).send(id);
    }, next);
  }

  deleteImage(req, res, next) {
    catchHandler(async () => {
      await userImagesService.deleteImage(req.params.id);
      res.status(200).send();
    }, next);
  }
}

module.exports = new UserImagesController();
