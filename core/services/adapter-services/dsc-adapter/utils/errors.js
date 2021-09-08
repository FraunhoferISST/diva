const { customErrorFactory } = require("@diva/common/Error");
const { supportedDistributions } = require("./utils");

module.exports = {
  unsupportedDistributionsError: customErrorFactory(
    "UnsupportedDistributions",
    `The resource must have one of the supported distributions: ${supportedDistributions.join(
      ", "
    )}`,
    406
  ),
  notOfferedError: customErrorFactory(
    "NotOffered",
    "The resource is not offered on IDS Connector",
    404
  ),
  alreadyOfferedError: customErrorFactory(
    "AlreadyOffered",
    "The resource already have an offer on DSC",
    409
  ),
};
