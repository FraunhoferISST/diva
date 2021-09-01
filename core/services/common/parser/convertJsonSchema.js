const _ = require("lodash");

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
  const artifact = {
    [key]: {},
  };

  if (_.isPlainObject(_elasticsearch) && _elasticsearch.type !== undefined) {
    artifact[key].type = _elasticsearch.type;
  } else {
    artifact[key].type = defaultTypeMapper[type];
  }

  if (_.toLower(type) === "string" && artifact[key].type !== "keyword") {
    if (
      _.isPlainObject(_elasticsearch) &&
      _elasticsearch.analyzer !== undefined
    ) {
      artifact[key].analyzer = _elasticsearch.analyzer;
    } else {
      artifact[key].analyzer = defaultAnalyzer;
    }
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

const buildMapping = (schema, esMapping = true) => {
  let tmp = {};

  for (const [key, value] of Object.entries(schema)) {
    if (combinationKeys.includes(key)) {
      schema[key].forEach((elem) => {
        tmp = { ...tmp, ...buildMapping(elem, esMapping) };
      });
    }
    if (key === "properties") {
      const mappingElements = [];
      for (const [pk, pv] of Object.entries(value)) {
        if (hasCombinations(pv)) {
          let mapping = {};
          for (const elem of getCombinationsKeys(pv)) {
            mapping = { ...mapping, ...buildMapping(elem, esMapping) };
          }
          mappingElements.push({
            [pk]: esMapping ? { properties: mapping } : mapping,
          });
        }

        if (propertyIsScalar(pv.type)) {
          mappingElements.push(
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
          mappingElements.push(
            buildMapping(
              {
                properties: { [pk]: item },
              },
              esMapping
            )
          );
        }

        if (propertyIsObject(pv.type)) {
          const objMapping = buildMapping(pv, esMapping);
          mappingElements.push({
            [pk]: esMapping ? { properties: objMapping } : objMapping,
          });
        }
      }

      mappingElements.forEach((e) => {
        tmp = { ...tmp, ...e };
      });
    }
    if (key === "then") {
      tmp = { ...tmp, ...buildMapping(schema.then, esMapping) };
    }
  }
  return tmp;
};

module.exports = {
  /* toMetadataObject: (schema) => {
    buildMapping(schema, false);
  }, */
  toEsMapping: (schema) => ({
    mappings: { properties: buildMapping(schema, true) },
  }),
};
