const policiesRulesService = require("../services/PoliciesRulesService");

class PoliciesRulesController {
  async enforcePolicies(req, res, next) {
    try {
      const result = await policiesRulesService.enforcePolicies(req);
      // TODO: response with relevant data
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new PoliciesRulesController();
