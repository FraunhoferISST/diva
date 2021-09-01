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
  return Connector.putMapping(index, convertJsonSchema.toEsMapping(index));
};

module.exports = {
  getDbByEntityId,
  getOperation,
  putEsMapping,
};
