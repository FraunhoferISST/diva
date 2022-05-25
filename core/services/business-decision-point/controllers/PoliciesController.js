const policiesService = require("../services/PoliciesService");

class PoliciesController {
  async enforcePolicies(req, res, next) {
    try {
      const result = await policiesService.enforcePolicies(req);
      res.status(200).send(result);
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new PoliciesController();
