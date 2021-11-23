const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  fileNotFoundError: customErrorFactory(
    "FileNotFound",
    "The file with the supplied fileName not found",
    404
  ),
};
