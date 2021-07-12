const { humanReadable } = require("./human-readable");

const deltaToHumanReadable = (delta) => humanReadable(delta);

const sanitizeHistory = ({ _id, ...history }) => history;

module.exports = {
  deltaToHumanReadable,
  sanitizeHistory,
};
