const { v4 } = require("uuid");

const generateUserId = () => `user:uuid:${v4()}`;
const generateHistoryId = () => `history:uuid:${v4()}`;

module.exports = {
  generateUserId,
  generateHistoryId,
};
