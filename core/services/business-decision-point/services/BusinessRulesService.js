const domainRules = require("../static/businessRules");
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
    this.rules = domainRules;
  }

  async init() {
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
