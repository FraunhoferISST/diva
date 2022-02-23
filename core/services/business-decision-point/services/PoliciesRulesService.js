const { mongoDBConnector, neo4jConnector } = require("../utils/dbConnectors");
const { isConditionMet } = require("../utils/utils");

const policies = require("../static/policyRules");

class PoliciesRulesService {
  constructor() {
    this.policies = policies;
  }

  async init() {
    await mongoDBConnector.connect();
    await neo4jConnector.connect();
    this.neo4jClient = neo4jConnector.client;
  }

  async enforcePolicies(req) {
    // TODO Decide on a way of adding information about the action to the requests body
    // TODO Load corresponding policies from the DB, e.g. GET policies
    this.actorid = req.body["x-actorid"];
    this.entityid = req.body.entityid;

    const constraints = [];
    let decision = false;

    await Promise.all(
      policies.map(async (policy) => {
        const singleDecision = await isConditionMet(policy.condition, {
          entityid: this.entityid,
          actorid: this.actorid,
        });
        if (singleDecision === true) {
          constraints.push(policy.constraints);
          decision = true;
        }
      })
    );

    console.log("final result", decision);
    return {
      decision,
      constraints: this.merge(constraints),
    };
  }

  merge(constraints) {
    // TODO Merge constraints based on priority and deny-by-default on collisions
    return constraints;
  }
}

module.exports = new PoliciesRulesService();
