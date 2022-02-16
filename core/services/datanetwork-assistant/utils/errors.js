const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  nodeNotFoundError: customErrorFactory(
    "NodeNotFound",
    "Node for the given entity id not found",
    404
  ),
  edgeAlreadyExistsError: customErrorFactory(
    "EdgeAlreadyExists",
    "The edge type in between given entities already exists",
    409
  ),
  edgeNotFoundError: customErrorFactory(
    "EdgeNotFound",
    "Edge withe the given id not found",
    404
  ),
};
