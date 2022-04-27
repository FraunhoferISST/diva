const _ = require("lodash");
const { neo4jConnector, mongoDBConnector } = require("./dbConnectors");

const templatePattern = /{{(.*?)}}/gm;

/**
 * @param template {string} - template to substitute
 * @param data {object} - data to substitute the template with
 * @returns {string} - substituted template
 */
const substituteTemplate = (template, data) => {
  const templates = template.match(templatePattern).map((t) => ({
    template: t,
    prop: t.replace(/{{/g, "").replace(/}}/g, ""),
  }));
  let substitutedTemplate = template;
  for (const t of templates) {
    const pattern = new RegExp(_.escapeRegExp(t.template), "g");
    const [extractProp, extractPattern] = t.prop.trim().split("||");
    let value = null;
    if (extractPattern) {
      [value] =
        (_.get(data, extractProp.trim()) ?? "").match(extractPattern) ?? [];
    } else {
      value = _.get(data, t.prop);
    }
    substitutedTemplate = substitutedTemplate.replace(pattern, value);
  }
  return substitutedTemplate;
};

const conditionsRulesHandlerMap = {
  cypher: async (query, data) => {
    const session = neo4jConnector.client.session();
    const {
      records: [
        {
          _fields: [ruleMet],
        },
      ],
    } = await session
      .run(substituteTemplate(query, data))
      .finally(() => session.close());
    return ruleMet;
  },
  mongo: async (query, data) => {
    const substitutedQuery = Object.fromEntries(
      Object.entries(query).map(([k, v]) => {
        const isValueString = typeof v === "string";
        const value = isValueString ? v : JSON.stringify(v);
        const substitutedValue = templatePattern.test(value)
          ? substituteTemplate(value, data)
          : value;
        return [
          k,
          isValueString ? substitutedValue : JSON.parse(substitutedValue),
        ];
      })
    );
    return mongoDBConnector.collections.entities.find(substitutedQuery);
  },
};

const isSubConditionRuleMet = async (conditionRule, data) => {
  const conditionRuleType = Object.keys(conditionRule)[0];
  const { query } = conditionRule[conditionRuleType];
  return conditionsRulesHandlerMap[conditionRuleType](query, data);
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
        const dataValue = _.isArray(_.get(data, key))
          ? JSON.stringify(_.get(data, key))
          : _.get(data, key);
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
