const domainRules = require("../static/domainRules");
const {
  substituteTemplate,
  isConditionMet,
  getMatchingBusinessAssets,
} = require("../utils/utils");
const dependencyURLsMap = require("../utils/dependencyURLs");

const prepareAction = (action, message) =>
  JSON.parse(
    substituteTemplate(JSON.stringify(action), {
      ...message,
      ...dependencyURLsMap,
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
    this.rules = domainRules;
  }

  async init() {
    // TODO: load rules from DB
    return true;
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
