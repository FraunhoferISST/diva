const _ = require("lodash");
const { logger } = require("@diva/common/logger");
const { isConditionMet, getMatchingBusinessAssets } = require("../utils/utils");
const { mongoDBConnector } = require("../utils/dbConnectors");

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
      .find({ systemEntityType: "policy" })
      .toArray();

    if (this.policies.length === 0) {
      // TODO: need to handle race condition, EM may start later so no system entities will be loaded!
      logger.warn("🚫 No policies found in DB!");
    } else {
      logger.info(`✅ Loaded ${this.policies.length} policies`);
    }
  }

  async enforcePolicies(req) {
    const matchingPolicies = getMatchingBusinessAssets(req.body, this.policies);

    const excludes = [];
    let provisionalDecision = false;

    await Promise.all(
      matchingPolicies.map(async (policy) => {
        const singleDecision = await isConditionMet(policy.condition, req.body);
        if (singleDecision === true) {
          if (typeof policy.excludes !== "undefined") {
            excludes.push({
              priority: policy.priority,
              fields: policy.excludes,
            });
          }
          provisionalDecision = true;
        }
      })
    );

    if (provisionalDecision === false) {
      return {
        decision: provisionalDecision,
      };
    }

    const payload = {};
    const mergedExcludes = this.mergeExcludes(excludes);

    switch (req.body.method) {
      case "GET":
        payload.projections = {};
        mergedExcludes.forEach((excluded) => {
          payload.projections[excluded] = 0;
        });
        break;
      case "PATCH":
        provisionalDecision = mergedExcludes.every((excluded) => {
          if (_.has(req.body.body, excluded)) {
            payload.message = `Not allowed to patch field '${excluded}'`;
            return false;
          }
          return true;
        });
        break;
      default:
        break;
    }

    return {
      decision: provisionalDecision,
      payload,
    };
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
}

module.exports = new PoliciesService();
