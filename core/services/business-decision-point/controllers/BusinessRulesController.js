const businessRulesService = require("../services/BusinessRulesService");

class BusinessRulesController {
  async requestRulesActions(req, res, next) {
    try {
      const result = await businessRulesService.requestRulesActions(req.body);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new BusinessRulesController();
