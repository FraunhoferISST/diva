const { createError, customErrorFactory } = require("@diva/common/Error");

module.exports = {
  createError,
  noSensorsFoundError: customErrorFactory(
    "NoSensorsFound",
    "The provided sensors couldn't be found",
    404
  ),
  requestCanceledError: customErrorFactory(
    "requestCanceledError",
    "The request was canceled by client",
    400
  ),
};
