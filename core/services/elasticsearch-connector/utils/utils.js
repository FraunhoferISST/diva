const loadJsonSchema = require("@diva/common/loadJsonSchema");
const convertJsonSchema = require("@diva/common/parser/convertJsonSchema");
const Connector = require("../Connector");
const esSettings = require("../customSettings.json");

const getDbByEntityId = (id) => {
  const entityType = id.slice(0, id.indexOf(":"));
  return {
    dbName: `${entityType}sDb`,
    collection: `${entityType}s`,
  };
};

const operationsMap = {
  create: Connector.index,
  update: Connector.index,
  delete: Connector.delete,
};

const getOperation = (type) => operationsMap[type];

const createIndex = async (index) => {
  console.info(`🗺️  set setting and mapping for index ${index}`);
  const schema = await loadJsonSchema(index.slice(0, -1));
  return Connector.createIndex(
    index,
    esSettings,
    convertJsonSchema.toEsMapping(schema)
  );
};

module.exports = {
  getDbByEntityId,
  getOperation,
  createIndex,
};
