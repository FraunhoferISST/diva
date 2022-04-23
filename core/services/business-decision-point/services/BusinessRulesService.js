const { logger } = require("@diva/common/logger");
const { mongoDBConnector } = require("../utils/dbConnectors");

const {
  substituteTemplate,
  isConditionMet,
  getMatchingBusinessAssets,
} = require("../utils/utils");
const servicesURLsMap = require("../utils/servicesURLs");

const prepareAction = (action, message) =>
  JSON.parse(
    substituteTemplate(JSON.stringify(action), {
      ...message,
      ...servicesURLsMap,
    })
  );

const getRuleActions = async (rule, message) => {
  if (await isConditionMet(rule.condition, message)) {
    return rule.actions.map((a) => prepareAction(a, message));
  }
  return [];
};

class BusinessRulesService {
  constructor() {
    this.rules = [];
  }

  async init() {
    this.collection = mongoDBConnector.collections.systemEntities;
    return this.cacheRules();
  }

  async cacheRules() {
    this.rules = await this.collection
      .find({ systemEntityType: "rule" })
      .toArray();

    if (this.rules.length === 0) {
      logger.warn(
        "🚫 No rules found in DB! Admin should check whether this is desired!"
      );
    } else {
      logger.info(`✅ Loaded ${this.rules.length} rules`);
    }
  }

  async requestRulesActions(message) {
    const matchingRules = getMatchingBusinessAssets(message, this.rules);
    const actions = [];
    for (const rule of matchingRules) {
      const ruleActions = await getRuleActions(rule, message);
      actions.push(...ruleActions);
    }
    return actions;
  }
}

module.exports = new BusinessRulesService();
