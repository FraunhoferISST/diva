const _ = require("lodash");
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

    // TODO: load policies from db
    // return true;
  }

  async enforcePolicies(req) {
    this.actorid = req.body["x-actorid"];
    this.entityid = req.body.entityid;

    const constraints = [];
    let resolvedConditions = [];
    // TODO GET policies

    await Promise.all(
      policies.map(async (policy) => {
        resolvedConditions = await isConditionMet(policy.condition, {
          entityid: this.entityid,
          actorid: this.actorid,
        });
      })
    );

    console.log("final result", resolvedConditions);
    return {
      decision: resolvedConditions,
      constraints: this.merge(constraints),
    };

  }

  merge(constraints) {
    return constraints;
  }
}

module.exports = new PoliciesRulesService();
