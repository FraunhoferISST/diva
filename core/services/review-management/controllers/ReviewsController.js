const messagesProducer = require("@diva/common/messaging/MessageProducer");
const reviewsService = require("../services/ReviewsService");

class ReviewsController {
  async createReview(req, res, next) {
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

  async getReviews(req, res, next) {
    try {
      const result = await reviewsService.get(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getReview(req, res, next) {
    try {
      const result = await reviewsService.getById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async patchReview(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      const { belongsTo } = await reviewsService.patchById(
        id,
        req.body,
        actorId
      );
      res.status(200).send();
      messagesProducer.produce(id, actorId, belongsTo, "update");
    } catch (err) {
      return next(err);
    }
  }

  async deleteReview(req, res, next) {
    try {
      const { id } = req.params;
      const actorId = req.headers["x-actorid"];
      const { belongsTo } = await reviewsService.deleteById(id, actorId);
      res.status(200).send();
      messagesProducer.produce(id, actorId, belongsTo, "delete");
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new ReviewsController();
