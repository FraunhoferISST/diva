const connector = require("../Connector");

const operationsMap = {
  create: connector.index,
  update: connector.index,
  delete: connector.delete,
};

const getOperation = (type) => operationsMap[type];

module.exports = {
  getOperation,
};
