const _ = require("lodash");
const { mongoDBConnector, neo4jConnector } = require("../utils/dbConnectors");
const { isConditionMet } = require("../utils/utils");

const policies = require("../static/policyRules");

class PolicyRulesService {
  constructor() {
    this.policies = policies;
  }

  async init() {
    await mongoDBConnector.connect();
    await neo4jConnector.connect();
    this.neo4jClient = neo4jConnector.client;
  }

  async enforcePolicies(req) {
    this.method = req.body.method;
    this.actorid = req.body.actorid;
    this.entityid = req.body.url.split("/").slice(-1)[0];
    this.body = req.body.body;
    // TODO Decide on a way of adding information about the action to the requests body
    // TODO Load corresponding policies from the DB, e.g. GET policies

    console.log(this.method, this.actorid, this.entityid, this.body);

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
    const mergedConstraints = this.mergeConstraints(constraints);
    const metadata = {};

    switch (this.method) {
      case "GET":
        metadata.projections = {};
        for (const excluded of mergedConstraints.excluded) {
          metadata.projections[excluded] = 0;
        }
        for (const included of mergedConstraints.included) {
          metadata.projections[included] = 1;
        }
        break;
      case "PATCH":
        decision = !mergedConstraints.excluded.some((excluded) => {
          if (_.has(this.body, excluded)) {
            metadata.message = `Not allowed to patch field '${excluded}'`;
            return true;
          }
          return false;
        });
        break;
      default:
        console.log("default");
    }

    console.log("final result", decision);
    return {
      decision,
      metadata,
    };
  }

  mergeConstraints(constraints) {
    const sortedConstraints = constraints.sort(
      (a, b) => a.priority - b.priority
    );

    const mergedConstraints = {
      included: [],
      excluded: [],
    };
    let lastPriority = -1;

    sortedConstraints.forEach((currentConstraint) => {
      if (currentConstraint.priority > lastPriority) {
        mergedConstraints.included = [
          ...new Set([
            ...mergedConstraints.included.filter(
              (field) => !currentConstraint.excluded.includes(field)
            ),
            ...currentConstraint.included.filter(
              (field) => !currentConstraint.excluded.includes(field)
            ),
          ]),
        ];

        mergedConstraints.excluded = [
          ...new Set([
            ...mergedConstraints.excluded.filter(
              (field) => !currentConstraint.included.includes(field)
            ),
            ...currentConstraint.excluded,
          ]),
        ];
      } else {
        mergedConstraints.included = [
          ...new Set([
            ...mergedConstraints.included.filter(
              (field) => !currentConstraint.excluded.includes(field)
            ),
            ...currentConstraint.included.filter(
              (field) =>
                !mergedConstraints.excluded.includes(field) &&
                !currentConstraint.excluded.includes(field)
            ),
          ]),
        ];

        mergedConstraints.excluded = [
          ...new Set([
            ...mergedConstraints.excluded,
            ...currentConstraint.excluded,
          ]),
        ];
      }

      lastPriority = currentConstraint.priority;
    });

    return mergedConstraints;
  }
}

module.exports = new PolicyRulesService();
