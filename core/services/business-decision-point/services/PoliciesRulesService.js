const { mongoDBConnector, neo4jConnector } = require("../utils/dbConnectors");
const { isConditionMet } = require("../utils/utils");

const policies = require("../static/policyRules");
const { sort } = require("../static/policyRules");

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
          constraints.push({
            priority: policy.priority,
            ...policy.constraints,
          });
          decision = true;
        }
      })
    );

    // TODO merge constraints, prepare for GET (create mongo projection),
    //  or deny PATCH when field that is to be patched is not included in allowed constraints

    console.log("final result", decision);
    return {
      decision,
      constraints: this.mergeConstraints(constraints),
    };
  }

  mergeConstraints(constraints) {
    const sortedConstraints = constraints.sort(
      (a, b) => a.priority - b.priority
    );
    // TODO Merge constraints based on priority and deny-by-default on collisions
    const mergedConstraints = {
      included: [],
      excluded: [],
    };
    let lastPriority = -1;

    sortedConstraints.forEach((currentConstraint) => {
      mergedConstraints.included = [
        ...new Set([
          ...mergedConstraints.included,
          ...currentConstraint.included,
        ]),
      ];

      if (lastPriority <= currentConstraint.priority) {
        mergedConstraints.excluded = mergedConstraints.excluded.filter(
          (field) => !currentConstraint.included.includes(field)
        );
        mergedConstraints.included = mergedConstraints.included.filter(
          (field) => !currentConstraint.excluded.includes(field)
        );
        mergedConstraints.excluded = [
          ...new Set([
            ...mergedConstraints.excluded,
            ...currentConstraint.excluded,
          ]),
        ];
      } else {
        currentConstraint.excluded.forEach((currentExcluded) => {
          if (!mergedConstraints.excluded.includes(currentExcluded)) {
            mergedConstraints.excluded = [
              ...new Set([...mergedConstraints.excluded, currentExcluded]),
            ];
          }
        });
      }

      lastPriority = currentConstraint.priority;
    });

    return mergedConstraints;
  }
}

module.exports = new PoliciesRulesService();
