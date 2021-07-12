const bcrypt = require("bcryptjs");

const isValidUserRequestDoc = (userDoc) =>
  userDoc && userDoc.email && userDoc.username && userDoc.password;

const isCorrectPassword = (user, password) =>
  bcrypt.compare(password, user.password);

const hashPassword = (clearTextPw) => bcrypt.hash(clearTextPw, 14);
const sanitizeUser = ({ password, _id, ...user }) => user;

module.exports = {
  isValidUserRequestDoc,
  sanitizeUser,
  isCorrectPassword,
  hashPassword,
};
