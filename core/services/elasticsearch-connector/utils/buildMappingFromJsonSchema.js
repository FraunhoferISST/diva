const _ = require("lodash");
const axios = require("axios");
const { serviceInstanceId } = require("@diva/common/utils/serviceInstanceId");
const urljoin = require("url-join");

const ENTITY_MANAGEMENT_URL = process.env.SCHEMA_URL || "http://localhost:3000";

const fetchSchema = (schemaName = "entity") =>
  axios.get(
    urljoin(
      ENTITY_MANAGEMENT_URL,
      "systemEntities/resolvedSchemas",
      schemaName
    ),
    {
      headers: { "x-actorid": serviceInstanceId },
    }
  );

const combinationKeys = ["allOf", "anyOf", "oneOf"];

const defaultTypeMapper = {
  string: "text",
  number: "double", // most used is 64-bit floating point IEEE 754
  integer: "long", // JS max/min 2^53-1, ES integer only 2^31-1, ES long 2^63-1
  boolean: "boolean",
  object: "object",
};

const defaultAnalyzer = "standard";

const buildMappingArtifact = (key, type, _elasticsearch) => {
  let artifact = {
    [key]: {},
  };

  if (_elasticsearch?.enabled === false) {
    return {};
  }

  // set type of the field
  if (_.isPlainObject(_elasticsearch) && _elasticsearch.type !== undefined) {
    artifact[key].type = _elasticsearch.type;
  } else {
    artifact[key].type = defaultTypeMapper[type];
  }

  // set analyzer of the field if it is a text
  if (_.toLower(type) === "string" && artifact[key].type === "text") {
    if (
      _.isPlainObject(_elasticsearch) &&
      _elasticsearch.analyzer !== undefined
    ) {
      artifact[key].analyzer = _elasticsearch.analyzer;
    } else {
      artifact[key].analyzer = defaultAnalyzer;
    }
  }
  if (_.isPlainObject(_elasticsearch) && _elasticsearch.enabled === false) {
    artifact = {}; // artifact[key].enabled = false;
  }

  return artifact;
};

const getTypeHelper = (type) => {
  if (_.isString(type)) {
    return _.toLower(type);
  }
  if (_.isArray(type)) {
    return type.find((t) => t !== "null");
  }
  return "string"; // Emergency Fallback (should not occur in DIVA!)
};

const propertyIsScalar = (pT) => {
  if (
    _.isString(pT) &&
    (_.toLower(pT) === "string" ||
      _.toLower(pT) === "number" ||
      _.toLower(pT) === "integer" ||
      _.toLower(pT) === "boolean")
  ) {
    return true;
  }

  return (
    _.isArray(pT) &&
    (_.includes(pT, "string") ||
      _.includes(pT, "number") ||
      _.includes(pT, "integer") ||
      _.includes(pT, "boolean"))
  );
};

const propertyIsArray = (pT) => {
  if (_.isString(pT) && _.toLower(pT) === "array") {
    return true;
  }

  return _.isArray(pT) && _.includes(pT, "array");
};

const propertyIsObject = (pT) => {
  if (_.isString(pT) && _.toLower(pT) === "object") {
    return true;
  }

  return _.isArray(pT) && _.includes(pT, "object");
};

const hasCombinations = (obj) =>
  Object.keys(obj).some((k) => combinationKeys.includes(k));

const getCombinationsKeys = (obj) =>
  Object.keys(obj).filter((k) => combinationKeys.includes(k));

const isScalarSchema = (schema) =>
  Object.keys(schema).filter((prop) =>
    [...combinationKeys, "properties", "if", "then"].includes(prop)
  ).length === 0;

const buildMapping = (schema, esMapping = true) => {
  let tmp = {};
  if (schema?._elasticsearch?.enabled === false) {
    return tmp;
  }
  const handleDirectProp = (pk, pv) => {
    const directMappingElements = [];
    if (propertyIsScalar(pv.type)) {
      directMappingElements.push(
        buildMappingArtifact(pk, getTypeHelper(pv.type), pv._elasticsearch)
      );
    }

    if (propertyIsArray(pv.type)) {
      let item = pv.items;
      // go through nested arrays
      while (propertyIsArray(item.type)) {
        item = item.items;
      }
      // create mapping from last level definitions
      directMappingElements.push(
        buildMapping(
          {
            properties: { [pk]: item },
          },
          esMapping
        )
      );
    }

    if (propertyIsObject(pv.type)) {
      if (!pv.properties) {
        directMappingElements.push(
          buildMappingArtifact(pk, getTypeHelper(pv.type), pv._elasticsearch)
        );
      } else {
        const objMapping = buildMapping(pv, esMapping);
        directMappingElements.push({
          [pk]: esMapping ? { properties: objMapping } : objMapping,
        });
      }
    }
    return directMappingElements;
  };

  if (isScalarSchema(schema)) {
    return {
      ...(schema._elasticsearch ? schema._elasticsearch : {}),
      type:
        schema?._elasticsearchschema?.type ?? defaultTypeMapper[schema.type],
    };
  }

  for (const [key, value] of Object.entries(schema)) {
    if (combinationKeys.includes(key)) {
      for (const elem of schema[key]) {
        tmp = { ...tmp, ...buildMapping(elem, esMapping) };
      }
    }
    if (key === "properties") {
      const mappingElements = [];
      for (const [pk, pv] of Object.entries(value)) {
        if (pk === "location") {
          mappingElements.push({
            [pk]: {
              type: "geo_shape",
            },
          });
        } else {
          if (hasCombinations(pv)) {
            let mapping = {};
            for (const elem of getCombinationsKeys(pv)) {
              mapping = {
                ...mapping,
                ...buildMapping({ [elem]: pv[elem] }, esMapping),
              };
            }
            const needWrapper = !getCombinationsKeys(pv).every((combKey) =>
              pv[combKey].every((def) => propertyIsScalar(def.type))
            );
            mappingElements.push({
              [pk]:
                esMapping && needWrapper ? { properties: mapping } : mapping,
            });
          }
          mappingElements.push(...handleDirectProp(pk, pv));
        }
      }
      for (const elem of mappingElements) {
        tmp = { ...tmp, ...elem };
      }
    }
    if (key === "then") {
      if (!(value?._elasticsearch?.enabled === false)) {
        tmp = { ...tmp, ...buildMapping(schema.then, esMapping) };
      }
    }
  }
  return tmp;
};

module.exports = async (schemaName) => {
  const { data: jsonSchema } = await fetchSchema(schemaName);
  return { properties: buildMapping(jsonSchema, true) };
};
