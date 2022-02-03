const messagesProducer = require("@diva/common/messaging/MessageProducer");
const reviewsService = require("../services/ReviewsService");
const EntityController = require("./EntityController");

class ReviewsController extends EntityController {
  async create(req, res, next) {
    try {
      const newReviewId = await reviewsService.create(
        req.body,
        req.headers["x-actorid"]
      );
      res.status(201).send(newReviewId);
      messagesProducer.produce(
        newReviewId,
        req.headers["x-actorid"],
        "create",
        [req.body.belongsTo]
      );
    } catch (err) {
      return next(err);
    }
  }

  async patchById(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      const { belongsTo } = await reviewsService.getById(id);
      await reviewsService.patchById(id, req.body, actorId);
      res.status(200).send();
      messagesProducer.produce(id, actorId, "update", [belongsTo]);
    } catch (err) {
      return next(err);
    }
  }

  async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      await reviewsService.updateById(id, req.body, actorId);
      res.status(200).send();
      messagesProducer.produce(id, actorId, "update", [req.body.belongsTo]);
    } catch (err) {
      return next(err);
    }
  }

  async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      const { belongsTo } = await reviewsService.getById(id);
      await reviewsService.deleteById(id, actorId);
      res.status(200).send();
      messagesProducer.produce(id, actorId, "delete", [belongsTo]);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ReviewsController(reviewsService);
