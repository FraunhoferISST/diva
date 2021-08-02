const { createError, customErrorFactory } = require("@diva/common/Error");

module.exports = {
  createError,
  noSensorsFoundError: customErrorFactory(
    "NoSensorsFound",
    "The provided sensors couldn't be found",
    404
  ),
};
