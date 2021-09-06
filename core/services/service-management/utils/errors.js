const { customErrorFactory, catchHandler } = require("@diva/common/Error");

module.exports = {
  catchHandler,
  serviceNotFoundError: customErrorFactory(
    "ServiceNotFound",
    "Service with the given id not found",
    404
  ),
  linkServiceToItselfError: customErrorFactory(
    "linkServiceToItselfError",
    "Can not link service to itself",
    400
  ),
};
