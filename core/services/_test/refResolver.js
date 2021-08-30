const chalk = require("chalk");
const axios = require("axios");
const urljoin = require("url-join");
const path = require("path");
const _ = require("lodash");
const $RefParser = require("@apidevtools/json-schema-ref-parser");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const esMapping = { mappings: { properties: {}}};
  
const defaultTypeMapper = {
  string: "text",
  number: "double", // most used is 64-bit floating point IEEE 754
  integer: "long", // JS max/min 2^53-1, ES integer only 2^31-1, ES long 2^63-1 
  boolean: "boolean",
  object: "object",
};

const defaultAnalyzer = "standard";

const buildMappingArtifact = (key, type, _elasticsearch) => {
  const artifact = {};
  artifact[key] = {};

  if (_.isPlainObject(_elasticsearch) && _elasticsearch.type !== undefined) {
    console.log(
      chalk.cyanBright(`🐛 found ES Type Property!`)
    );
    artifact[key]["type"] = _elasticsearch.type;
  } else {
    artifact[key]["type"] = defaultTypeMapper[type];
  }

  if (_.toLower(type) === "string") {
    if (_.isPlainObject(_elasticsearch) && _elasticsearch.analyzer !== undefined) {
      console.log(
        chalk.cyanBright(`🐛 found ES Analyzer Property!`)
      );
      artifact[key]["analyzer"] = _elasticsearch.analyzer;
    } else {
      artifact[key]["analyzer"] = defaultAnalyzer;
    }
  }

  return artifact;
};

const getTypeHelper = (type) => {
  if (_.isString(type)) {
    return _.toLower(type);
  }
  if (_.isArray(type)) {
    for (let i=0; i < type.length; i++) {
      if (type[i] !== "null") {
        return type[i];
      }
    }
  }

  return "string"; // Emergency Fallback (should not occure in DIVA!)
}

const propertyIsScalar = (pT) => {
  if (_.isString(pT) && (_.toLower(pT) === "string" || _.toLower(pT) === "number" || _.toLower(pT) === "integer" || _.toLower(pT) === "boolean")) {
    console.log(
      chalk.blue(`🐛 "propertyIsScalar": found scalar type ${pT}`)
    );
    return true;
  }

  if (_.isArray(pT) && (_.includes(pT, "string") || _.includes(pT, "number") || _.includes(pT, "integer") || _.includes(pT, "boolean"))) {
    console.log(
      chalk.blue(`🐛 "propertyIsScalar": found scalar type in multitype: ${pT}`)
    );
    return true;
  }

  return false;
};

const propertyIsArray = (pT) => {
  if (_.isString(pT) && _.toLower(pT) === "array") {
    console.log(
      chalk.blue(`🐛 "propertyIsArray": found array type`)
    );
    return true;
  }

  if (_.isArray(pT) && _.includes(pT, "array")) {
    console.log(
      chalk.blue(`🐛 "propertyIsArray": found array type in multitype: ${pT}`)
    );
    return true;
  }

  return false;
};

const propertyIsObject = (pT) => {
  if (_.isString(pT) && _.toLower(pT) === "object") {
    console.log(
      chalk.blue(`🐛 "propertyIsObject": found object type`)
    );
    return true;
  }

  if (_.isArray(pT) && _.includes(pT, "object")) {
    console.log(
      chalk.blue(`🐛 "propertyIsObject": found object type in multitype: ${pT}`)
    );
    return true;
  }

  return false;
};

const buildMapping = (schema) => {
    
    let tmp = {};

    _.forOwn(schema, (value, key) => {
        if (key === "allOf" || key === "anyOf") {
            console.log(
                chalk.green(`🐛 need to iterate array...`)
            );
            schema[key].forEach((e) => {
                console.log(
                    chalk.green(`🐛 recusive call`)
                );
                tmp = {...tmp, ...buildMapping(e)};
            });
        }
        if (key === "properties") {
            const mappingElements = [];
            console.log(
                chalk.green(`🐛 found "properties"`)
            );
            _.forOwn(value, (pv,pk) => {
                console.log(
                    chalk.green(`🐛 found property: ${pk} with type: ${pv.type}`)
                );

                // check if on scalar level
                if (propertyIsScalar(pv.type)) {
                  mappingElements.push(buildMappingArtifact(pk, getTypeHelper(pv.type), pv._elasticsearch));
                }

                propertyIsArray(pv.type); // TODO

                if (propertyIsObject(pv.type)) {
                  const objMapping = buildMapping(pv);
                  mappingElements.push({[pk]: objMapping});
                }
            });
            
          
            mappingElements.forEach((e) => {
              tmp = {...tmp, ...e};
            });
        }
        if (key === "then") {
            console.log(
                chalk.yellow(`🐛 no idea jet...`)
            );
        }
    });

    return tmp;
};

const myResolver = {
  order: 1,
  canRead: true,
  async read(file, callback, $refs) {
    return axios
      .get(urljoin(SCHEMA_REGISTRY_URL, "schemata", path.basename(file.url)))
      .then((res) => res.data);
  },
};

(async () => {
  try {
    console.log("START...");
    const schema = await $RefParser.dereference("resource", {
      resolve: { registry: myResolver },
    });
    esMapping.mappings.properties = {...buildMapping(schema)};
    console.log(JSON.stringify(esMapping));
  } catch (err) {
    console.error(err);
  }
})();
