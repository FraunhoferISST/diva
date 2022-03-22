const {
  genericError,
  catchHandler,
  createError,
  customErrorFactory,
} = require("@diva/common/Error");

module.exports = {
  genericError,
  catchHandler,
  createError,
  invalidDataError: customErrorFactory(
    "InvalidDataSupplied",
    "Invalid data supplied for the operation",
    406
  ),
  userAlreadyExistsError: customErrorFactory(
    "UserAlreadyExists",
    "User with the given email already exists",
    409
  ),
  userNotFoundError: customErrorFactory(
    "UserNotFound",
    "User with the given id not found",
    404
  ),
  userNotAuthenticatedError: customErrorFactory(
    "Authentication",
    "User is not authenticated",
    401
  ),
  imageNotFoundError: customErrorFactory(
    "ImageNotFound",
    "Image with the provided id not found",
    404
  ),
  wrongImageFormatError: customErrorFactory(
    "ImageFormat",
    "Image format not supported. Provide PNG or JPG file",
    406
  ),
};
