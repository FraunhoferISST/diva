const { buildInMemoryDb, getSchemaByName } = require("../utils/inMemoryDb");
const dereferenceSchema = require("../utils/dereferenceSchema");
const { toEsMapping } = require("../utils/convertJsonSchemaToEsMapping");
const { schemaNotFoundError } = require("../utils/errors");

const jsonSchemaInstances = ["entity"];

class SchemaService {
  async init() {
    await buildInMemoryDb();
    this.resolvedSchemas = await Promise.all(
      jsonSchemaInstances.map(async (s) => ({
        name: s,
        schema: await dereferenceSchema(s),
      }))
    );
    this.esMappings = this.resolvedSchemas.map((s) => ({
      name: s.name,
      mapping: toEsMapping(s.schema),
    }));
  }

  getByName(name) {
    return getSchemaByName(name);
  }

  getResolvedByName(schemaName) {
    const resolvedSchema = this.resolvedSchemas.find(
      ({ name }) => name === schemaName
    );
    if (resolvedSchema) {
      return resolvedSchema;
    }
    throw schemaNotFoundError;
  }

  getESMappings() {
    return this.esMappings;
  }
}

module.exports = new SchemaService();
