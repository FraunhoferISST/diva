const Connector = require("../Connector");

const getDbByEntityId = (id) => id.slice(0, id.indexOf(":"));

const operationsMap = {
  create: Connector.create,
  update: Connector.update,
  delete: Connector.delete,
};

const getOperation = (type) => operationsMap[type];

const createConstraints = (neo4jLabels) =>
  Connector.createConstraints(neo4jLabels);

module.exports = {
  createConstraints,
  getDbByEntityId,
  getOperation,
};
