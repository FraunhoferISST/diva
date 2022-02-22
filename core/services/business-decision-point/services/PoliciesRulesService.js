const policies = require("../static/rules.json");

class PoliciesRulesService {
  constructor() {
    this.policies = policies;
  }

  async init() {
    // TODO: load policies from db
    return true;
  }

  async enforcePolicies(req) {
    // TODO: do some stuff
    return true; // or false;
  }
}

module.exports = new PoliciesRulesService();
