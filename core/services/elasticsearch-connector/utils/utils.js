const connector = require("../services/ConnectorService");

const operationsMap = {
  create: connector.index,
  update: connector.index,
  delete: connector.delete,
};

const getOperation = (type) => operationsMap[type];

module.exports = {
  getOperation,
};
