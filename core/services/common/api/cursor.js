const encodeCursor = (data) => Buffer.from(data, "utf8").toString("base64");
const decodeCursor = (data) => Buffer.from(data, "base64").toString();

module.exports = {
  encodeCursor,
  decodeCursor,
};
