const _ = require("lodash");
const { neo4jConnector, mongoDBConnector } = require("./dbConnectors");

const substituteTemplate = (template, data) => {
  const templatePattern = /{{(.*?)}}/gm;
  const templates = template.match(templatePattern).map((t) => ({
    template: t,
    prop: t.replace(/{{/g, "").replace(/}}/g, ""),
  }));
  let substitutedTemplate = template;
  for (const t of templates) {
    const pattern = new RegExp(_.escapeRegExp(t.template), "g");
    const value = _.get(data, t.prop);
    substitutedTemplate = substitutedTemplate.replace(pattern, value);
  }
  return substitutedTemplate;
};

const conditionsRulesHandlerMap = {
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
  return conditionsRulesHandlerMap[conditionRuleType](query);
};

const isConditionMet = async (condition, data) => {
  if (condition === true) {
    return true;
  }
  const resolvedConditions = [];
  for (const [modifier, subConditions] of Object.entries(condition)) {
    const modifierMethod = modifier === "and" ? "every" : "some";
    const conditionMet = (
      await Promise.all(
        subConditions.map((r) => isSubConditionRuleMet(r, data))
      )
    )[modifierMethod]((met) => met);
    resolvedConditions.push(conditionMet);
  }
  return resolvedConditions.every((met) => met);
};

const getMatchingBusinessAssets = (data, assets) => {
  const matchingAssets = [];
  for (const asset of assets) {
    const { scope } = asset;
    if (
      Object.entries(scope).every(([key, value]) => {
        const dataValue = _.get(data, key);
        return new RegExp(value).test(dataValue);
      })
    ) {
      matchingAssets.push(asset);
    }
  }
  return matchingAssets;
};

module.exports = {
  substituteTemplate,
  conditionsRulesHandlerMap,
  isSubConditionRuleMet,
  isConditionMet,
  getMatchingBusinessAssets,
};
