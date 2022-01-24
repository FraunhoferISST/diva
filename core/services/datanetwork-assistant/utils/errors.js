const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  nodeNotFoundError: customErrorFactory(
    "NodeNotFound",
    "Node for the given entity id not found",
    404
  ),
  edgeNotFoundError: customErrorFactory(
    "EdgeNotFound",
    "Edge withe the given id not found",
    404
  ),
  resourceNotFoundError: customErrorFactory(
    "ResourceNotFound",
    "Resource with given resource id not found",
    404
  ),
};
