const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  dagNotFoundError: customErrorFactory(
    "DAGNotFound",
    "DAG for given resource id not found",
    404
  ),
  resourceNotFoundError: customErrorFactory(
    "ResourceNotFound",
    "Resource with given resource id not found",
    404
  ),
};
