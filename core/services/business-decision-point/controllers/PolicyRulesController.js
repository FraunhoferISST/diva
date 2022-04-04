const policyRulesService = require("../services/PoliciesService");

class PoliciesRulesController {
  async enforcePolicies(req, res, next) {
    try {
      const result = await policyRulesService.enforcePolicies(req);
      // TODO: response with relevant data
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new PoliciesRulesController();
