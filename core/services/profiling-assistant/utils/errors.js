const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  dagNotFoundError: customErrorFactory(
    "DAGNotFound",
    "DAG for given entity id not found",
    404
  ),
  entityNotFoundError: customErrorFactory(
    "EntityNotFound",
    "Entity with given id not found",
    404
  ),
};
