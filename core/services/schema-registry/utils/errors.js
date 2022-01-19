const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  schemaNotFoundError: customErrorFactory(
    "NotFound",
    "Can not find schema with the provided name",
    404
  ),
};
