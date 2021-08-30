const axios = require("axios");
const chalk = require("chalk");
const urljoin = require("url-join");
const Ajv19 = require("ajv/dist/2019");
const addFormats = require("ajv-formats");
const { createError } = require("./Error");
const _ = require("lodash");

const SCHEMA_REGISTRY_URL =
  process.env.SCHEMA_REGISTRY_URL || "http://localhost:3010/";

const defaultTypeMapper = {
    string: "text",
    number: "float",
    boolean: "boolean",
}

const esMapping = { mappings: {properties: {}}};

const allOfHandler = (allOf) => {

    _.forOwn(allOf, (value, key) => {
        if (value.properties !== undefined) {
            console.log(
                chalk.yellow(`🐛 It's a "properties"`)
            );

            propertiesHandler(value.properties);
        }

        if (value.$ref !== undefined) {
            console.log(
                chalk.yellow(`🐛 It's a "$ref"`)
            );
        }

        if (value.then !== undefined) {
            console.log(
                chalk.yellow(`🐛 It's a "then"`)
            );
        }
    });
};

const propertiesHandler = (properties) => {
    _.forOwn(properties, (value, key) => {
        console.log(
            chalk.yellow(`🐛 ${key}`)
        );

        esMapping.mappings.properties[key] = {
            "type": value._elasticsearch.type || "",
        }
    });

    console.log(JSON.stringify(esMapping));
};

const schemaReader = (subSchema) => {
    if (_.isPlainObject(subSchema.schema)) {
        _.forOwn(subSchema.schema, function(value, key) {
            if (key === "allOf") {
                allOfHandler(subSchema.schema.allOf);
            }
        });
    }
};

const buildMapping = (schema) => {
    console.log(
      chalk.blue(`🚀 Start building Elasticsearch Mapping from JSON Schema`)
    );

    if (schema.schemaEnv !== undefined) {
        const mapping = schemaReader(schema.schemaEnv);
    }
};


const loadSchemaResolver = async (uri) =>
  axios
    .get(urljoin(SCHEMA_REGISTRY_URL, "schemata", uri))
    .then((res) => res.data);

const compileValidator = async (schemaName) => {
  const ajv = new Ajv19({ loadSchema: loadSchemaResolver, strict: false });
  addFormats(ajv);

  const schema = await axios.get(
    urljoin(SCHEMA_REGISTRY_URL, "schemata", schemaName)
  );
  return ajv.compileAsync(schema.data).then((validator) => {
    console.log(
      chalk.blue(`✅ Received all JSON Schemata for entity "${schemaName}"`)
    );

    const schema = ajv.getSchema("resource");
    buildMapping(schema);    

    return validator;
  });
};

const validateJsonSchema = (schemaName, data, validator) => {
  const valid = validator(data);
  if (!valid) {
    console.warn(validator.errors);
    throw createError({
      type: "SchemaValidation",
      message: `Supplied data for the operation violates "${schemaName}" schema`,
      code: 406,
      errors: validator.errors,
    });
  }
  return valid;
};

class JsonSchemaValidator {
  async init(rootSchemas) {
    this.validators = Object.fromEntries(
      await Promise.all(
        rootSchemas.map(async (schemaName) => [
          schemaName,
          await compileValidator(schemaName),
        ])
      )
    );
  }

  test(schemaName) {
    const testVal = this.validators[schemaName];
    //console.log(testVal);
  }

  validate(schemaName, data) {
    const validator = this.validators[schemaName];
    return validateJsonSchema(schemaName, data, validator);
  }
}

jsv = new JsonSchemaValidator();

(async () => {
    try {
        await jsv.init(["resource"]);
        jsv.test("resource");
    } catch(e) {
        console.error(e);
    }
})();
