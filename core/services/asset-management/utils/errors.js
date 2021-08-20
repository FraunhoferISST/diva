const { customErrorFactory } = require("@diva/common/Error");

module.exports = {
  assetNotFoundError: customErrorFactory(
    "AssetNotFound",
    "Asset with the given id not found",
    404
  ),
  linkAssetToItselfError: customErrorFactory(
    "linkAssetToItselfError",
    "Can not link asset to itself",
    400
  ),
};
