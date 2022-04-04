const messagesProducer = require("@diva/common/messaging/MessageProducer");
const usersService = require("../services/UsersService");
const EntityController = require("./EntityController");

class UsersController extends EntityController {
  async create(req, res, next) {
    try {
      const actorid = req.headers["x-actorid"];
      const { id: newUserId, delta } = await usersService.create(
        req.body,
        req.headers["x-actorid"]
      );
      res.status(201).send(newUserId);
      messagesProducer.produce(
        newUserId,
        req.headers["x-actorid"] || newUserId,
        "create",
        [],
        { affectedFields: this.getAffectedFieldsFromDelta(delta) }
      );
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UsersController(usersService);
