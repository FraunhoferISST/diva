const messagesProducer = require("@diva/common/MessageProducer");
const usersService = require("../services/UsersService");

class UsersController {
  async registerUser(req, res, next) {
    try {
      const newUserId = await usersService.create(req.body);
      res.status(201).send(newUserId);
      messagesProducer.produce(newUserId, newUserId, "create");
    } catch (err) {
      return next(err);
    }
  }

  async createUser(req, res, next) {
    try {
      const newUserId = await usersService.create(
        req.body,
        req.headers["x-actorid"]
      );
      res.status(201).send(newUserId);
      messagesProducer.produce(
        newUserId,
        req.headers["x-actorid"] || newUserId,
        "create"
      );
    } catch (err) {
      return next(err);
    }
  }

  async getUsers(req, res, next) {
    try {
      const result = await usersService.get(req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const result = await usersService.getById(req.params.id, req.query);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }

  async patchUser(req, res, next) {
    try {
      const { id } = req.params;
      await usersService.patchById(id, req.body, req.headers["x-actorid"]);
      res.status(204).send();
      messagesProducer.produce(id, req.headers["x-actorid"], "update");
    } catch (err) {
      return next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      await usersService.deleteById(id, req.headers["x-actorid"]);
      res.status(200).send();
      messagesProducer.produce(id, req.headers["x-actorid"], "delete");
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new UsersController();
