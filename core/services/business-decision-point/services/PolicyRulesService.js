const _ = require("lodash");
const { mongoDBConnector, neo4jConnector } = require("../utils/dbConnectors");
const { isConditionMet } = require("../utils/utils");

// const policies = require("../static/policyRules");

class PolicyRulesService {
  // constructor() {
  //   this.policies = policies;
  // }

  async init() {
    await mongoDBConnector.connect();
    await neo4jConnector.connect();
    this.neo4jClient = neo4jConnector.client;
  }

  async enforcePolicies(req) {
    this.serviceName = req.body.serviceName;
    this.method = req.body.method;
    this.actorid = req.body.actorid;
    this.body = req.body.body;
    this.scopeUrl = req.body.url;
    this.entityid = undefined;

    if (
      new RegExp(
        "(user|resource|review|service|asset|policy):uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$"
      ).test(this.scopeUrl)
    ) {
      this.entityid = req.body.url.split("/").slice(-1)[0];
      this.scopeUrl = `${this.scopeUrl.substring(0, this.scopeUrl.lastIndexOf('/') + 1)}*`
    }

    // TODO Decide on a way of adding information about the action to the requests body
    // TODO Load corresponding policies from the DB, e.g. GET policies
    const query = {
      scope: { $in: [`${this.serviceName}::${this.scopeUrl}`] },
      method: { $in: [this.method] },
    };

    const policies = await this.executeQuery(query);

    const excludes = [];
    let decision = false;

    await Promise.all(
      policies.map(async (policy) => {
        const data = {
          ...(this.entityid && { entityid: this.entityid }),
          ...(this.actorid && { actorid: this.actorid }),
        };
        const singleDecision = await isConditionMet(policy.condition, data);
        if (singleDecision === true) {
          excludes.push({
            priority: policy.priority,
            fields: policy.excludes,
          });
          decision = true;
        }
      })
    );

    // TODO merge constraints, prepare for GET (create mongo projection),
    //  or deny PATCH when field that is to be patched is not included in allowed constraints
    const mergedExcludes = this.mergeExcludes(excludes);
    const metadata = {};

    switch (this.method) {
      case "GET":
        metadata.projections = {};
        mergedExcludes.forEach((excluded) => {
          metadata.projections[excluded] = 0;
        });
        break;
      case "PATCH":
        decision = !mergedExcludes.some((excluded) => {
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

    console.log("final result:", decision, "\nmetadata:", metadata);
    return {
      decision,
      metadata,
    };
  }

  async executeQuery(query) {
    try {
      const collection = mongoDBConnector.collections.systemEntities;
      await collection.find(query).toArray((err, policies) => {
        if (err) throw err;
        return policies;
      });
    } catch (error) {
      console.log(error);
    }
  }

  mergeExcludes(excludes) {
    const sortedExcludes = excludes.sort((a, b) => a.priority - b.priority);

    let mergedExcludes = [];
    let prevPriority = -1;

    sortedExcludes.forEach((currentExcludes) => {
      const filteredExcludes = [];
      const notExcludes = [];
      currentExcludes.fields.forEach((exclude) => {
        if (exclude.startsWith("!")) {
          notExcludes.push(exclude.substring(1));
        } else {
          filteredExcludes.push(exclude);
        }
      });

      if (currentExcludes.priority > prevPriority) {
        if (notExcludes.includes("*")) {
          mergedExcludes = [];
        } else {
          mergedExcludes = [
            ...new Set([
              ...mergedExcludes.filter((field) => !notExcludes.includes(field)),
              ...filteredExcludes.filter(
                (field) => !notExcludes.includes(field)
              ),
            ]),
          ];
        }
      } else if (!notExcludes.includes("*")) {
        mergedExcludes = [
          ...new Set([
            ...mergedExcludes,
            ...filteredExcludes.filter((field) => !notExcludes.includes(field)),
          ]),
        ];
      }
      prevPriority = currentExcludes.priority;
    });
    return mergedExcludes;
  }

  /**
   * @deprecated Replaced by excludes constraint system - see mergeExcludes()
   */
  mergeConstraints(constraints) {
    const sortedConstraints = constraints.sort(
      (a, b) => a.priority - b.priority
    );

    const mergedConstraints = {
      included: [],
      excluded: [],
    };
    let prevPriority = -1;

    sortedConstraints.forEach((currentConstraint) => {
      if (currentConstraint.priority > prevPriority) {
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

      prevPriority = currentConstraint.priority;
    });

    return mergedConstraints;
  }
}

module.exports = new PolicyRulesService();
