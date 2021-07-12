const { v4 } = require("uuid");

const generateResourceId = () => `resource:uuid:${v4()}`;
const generateHistoryId = () => `history:uuid:${v4()}`;

module.exports = {
  generateResourceId,
  generateHistoryId,
};
