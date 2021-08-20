const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  alreadyWroteReviewError: customErrorFactory(
    "UserAlreadyExists",
    "Review for this entity already created from this actor",
    409
  ),
  notReviewAuthorError: customErrorFactory(
    "PermissionDenied",
    "Only review authors can modify/delete reviews",
    403
  ),
};
