const { v4 } = require("uuid");

const generateAssetId = () => `asset:uuid:${v4()}`;
const generateHistoryId = () => `history:uuid:${v4()}`;

module.exports = {
  generateAssetId,
  generateHistoryId,
};
