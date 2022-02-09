const policyDecisionService = require("../services/policyDecisionService");

class PolicyDecisionController {
  async requestDecision(req, res, next) {
    try {
      const result = await policyDecisionService.requestDecision(req.body);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new PolicyDecisionController();