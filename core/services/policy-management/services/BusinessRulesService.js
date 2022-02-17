const _ = require("lodash");
const { mongoDBConnector, neo4jConnector } = require("../utils/dbConnectors");
const domainRules = require("../static/domainRules");

const substituteTemplate = (template, message) => {
  const templatePattern = /{{(.*?)}}/gm;
  const templates = template.match(templatePattern).map((t) => ({
    template: t,
    prop: t.replace(/{{/g, "").replace(/}}/g, ""),
  }));
  let substitutedTemplate = template;
  for (const t of templates) {
    const pattern = new RegExp(_.escapeRegExp(t.template), "g");
    const value = _.get(message, t.prop);
    substitutedTemplate = substitutedTemplate.replace(pattern, value);
  }
  return substitutedTemplate;
};

const conditionsRulesHandler = {
  cypher: async (query) => {
    const session = neo4jConnector.client.session();
    const {
      records: [
        {
          _fields: [ruleMet],
        },
      ],
    } = await session.run(query).finally(() => session.close());
    return ruleMet;
  },
  mongo: async (query) =>
    mongoDBConnector.client.collection.entities.find(JSON.parse(query)),
};

const isSubConditionRuleMet = async (conditionRule, data) => {
  const conditionRuleType = Object.keys(conditionRule)[0];
  const query = substituteTemplate(
    conditionRule[conditionRuleType].query,
    data
  );
  return conditionsRulesHandler[conditionRuleType](query);
};

const prepareAction = (action, message) => {
  const preparedAction = substituteTemplate(JSON.stringify(action), message);
  return JSON.parse(preparedAction);
};

const getRuleActions = async (rule, message) => {
  if (rule.condition === true) {
    rule.actions.map((a) => prepareAction(a, message));
  }
  const resolvedConditions = [];
  for (const [modifier, subConditions] of Object.entries(rule.condition)) {
    const modifierMethod = modifier === "and" ? "every" : "some";
    const conditionMet = (
      await Promise.all(
        subConditions.map((r) => isSubConditionRuleMet(r, message))
      )
    )[modifierMethod]((met) => met);
    resolvedConditions.push(conditionMet);
  }
  if (resolvedConditions.every((met) => met)) {
    return rule.actions.map((a) => prepareAction(a, message));
  }
  return [];
};

const getMatchingRules = (message, rules) => {
  const matchingRules = [];
  for (const rule of rules) {
    const { scope } = rule;
    if (
      Object.entries(scope).every(([key, value]) => {
        const messageValue = _.get(message, key);
        return new RegExp(value).test(messageValue);
      })
    ) {
      matchingRules.push(rule);
    }
  }
  return matchingRules;
};

class BusinessRulesService {
  constructor() {
    this.rules = domainRules;
  }

  async init() {
    return true;
  }

  async requestRulesActions(message) {
    const matchingRules = getMatchingRules(message, this.rules);
    const actions = [];
    for (const rule of matchingRules) {
      const ruleActions = await getRuleActions(rule, message);
      actions.push(...ruleActions);
    }
    return actions;
  }
}

module.exports = new BusinessRulesService();
