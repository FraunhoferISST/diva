const loadJsonSchema = require("@diva/common/loadJsonSchema");
const convertJsonSchema = require("@diva/common/parser/convertJsonSchema");
const Connector = require("../Connector");

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

const putEsMapping = async (index) => {
  console.info(`🗺️  set mapping for index ${index}`);
  try {
    const schema = await loadJsonSchema(index.slice(0, -1));
    return Connector.putMapping(index, convertJsonSchema.toEsMapping(schema));
  } catch (e) {
    throw new Error(e);
  }
};

module.exports = {
  getDbByEntityId,
  getOperation,
  putEsMapping,
};
