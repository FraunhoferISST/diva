const _ = require("lodash");
const messageConsumer = require("@diva/common/messaging/MessageConsumer");
const { isConditionMet, getMatchingBusinessAssets } = require("../utils/utils");
const { mongoDBConnector } = require("../utils/dbConnectors");
const { name: serviceName } = require("../package.json");

const KAFKA_CONSUMER_TOPICS = [
  {
    topic: "entity.events",
    spec: {
      name: "asyncapi",
    },
  },
];

class PolicyRulesService {
  async init() {
    this.collection = mongoDBConnector.collections.systemEntities;
    this.policies = await this.collection
      .find({ systemEntityType: "policy" })
      .toArray();

    if (this.policies.length === 0) {
      console.warn("🚫 No policies found in DB!");
    }

    await messageConsumer.init(KAFKA_CONSUMER_TOPICS, serviceName);
    await messageConsumer.consume(this.recachePoliciesOnMessage.bind(this));
  }

  async recachePoliciesOnMessage(message) {
    const parsedMessage = JSON.parse(message.value.toString());
    const {
      object: { id },
    } = parsedMessage.payload;
    if (
      /^policy:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        id
      )
    ) {
      console.info("🔁 Recaching policies");
      this.policies = await this.collection
        .find({ systemEntityType: "policy" })
        .toArray();
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
          excludes.push({
            priority: policy.priority,
            fields: policy.excludes,
          });
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

module.exports = new PolicyRulesService();
