const _ = require("lodash");
const { logger } = require("@diva/common/logger");
const { isConditionMet, getMatchingBusinessAssets } = require("../utils/utils");
const { mongoDBConnector } = require("../utils/dbConnectors");

const createProjection = (includedFields, excludedFields) => {
  if (includedFields.length === 0) {
    return Object.fromEntries(excludedFields.map((field) => [field, 0]));
  }

  return Object.fromEntries(
    includedFields
      .filter((n) => !excludedFields.includes(n))
      .map((field) => [field, 1])
  );
};

class PoliciesService {
  constructor() {
    this.policies = [];
  }

  async init() {
    this.collection = mongoDBConnector.collections.systemEntities;
    return this.cachePolicies();
  }

  async cachePolicies() {
    this.policies = await this.collection
      .find({ systemEntityType: "policy", isActive: true })
      .toArray();

    if (this.policies.length === 0) {
      logger.warn(
        "🚫 No policies found in DB! Admin should check whether this is desired!"
      );
    } else {
      logger.info(`✅ Loaded ${this.policies.length} policies`);
    }
  }

  async enforcePolicies(req) {
    const matchingPolicies = getMatchingBusinessAssets(req.body, this.policies);

    const includes = [];
    const excludes = [];
    let provisionalDecision = false;

    await Promise.all(
      matchingPolicies.map(async (policy) => {
        const singleDecision = await isConditionMet(policy.condition, req.body);
        logger.info("Ensuring matched policy", {
          policyId: policy.id,
          title: policy.title,
          scope: policy.scope,
          decision: singleDecision,
        });
        if (singleDecision) {
          if (Array.isArray(policy.includes)) {
            includes.push(...policy.includes);
          }
          if (Array.isArray(policy.excludes)) {
            excludes.push(...policy.excludes);
          }
          provisionalDecision = true;
        }
      })
    );

    if (!provisionalDecision) {
      return {
        decision: provisionalDecision,
      };
    }

    const payload = {};
    const uniqueIncludes = [...new Set(includes)];
    const uniqueExcludes = [...new Set(excludes)];
    const projection = createProjection(uniqueIncludes, uniqueExcludes);
    const includedFields = [];
    const excludedFields = [];

    switch (req.body.method) {
      case "GET":
        payload.projection = projection;
        break;
      case "POST":
      case "PUT":
      case "PATCH":
        for (const [key, value] of Object.entries(projection)) {
          if (value === 0) {
            excludedFields.push(key);
          } else if (value === 1) {
            includedFields.push(key);
          }
        }

        if (includedFields.length > 0) {
          provisionalDecision = Object.keys(req.body.body).every(
            (patchField) => {
              if (!includedFields.includes(patchField)) {
                payload.message = `Not allowed to patch field '${patchField}'`;
                return false;
              }
              return true;
            }
          );
        } else {
          provisionalDecision = excludedFields.every((excluded) => {
            if (_.has(req.body.body, excluded)) {
              payload.message = `Not allowed to patch field '${excluded}'`;
              return false;
            }
            return true;
          });
        }

        break;
      default:
        break;
    }

    return {
      decision: provisionalDecision,
      payload,
    };
  }
}

module.exports = new PoliciesService();
