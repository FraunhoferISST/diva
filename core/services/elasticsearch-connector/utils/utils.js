const Connector = require("../Connector");
const esSettings = require("../customSettings.json");
const mappingsMap = require("./mappings.json");

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
  return Connector.createIndex(index, esSettings, mappingsMap[index]);
};

module.exports = {
  getDbByEntityId,
  getOperation,
  createIndex,
};
