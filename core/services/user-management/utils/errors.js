class CustomError extends Error {
  constructor(
    type = "ServerError",
    message = "Some error occurred",
    code = 500,
    errors = []
  ) {
    super();
    this.type = type;
    this.message = message;
    this.code = code;
    this.errors = errors;
  }
}

const customErrorFactory = (type, message, code, errors) =>
  new CustomError(type, message, code, errors);

const catchHandler = (handler, next) =>
  handler().catch((e) =>
    e.code ? next(e) : next(customErrorFactory(undefined, e.toString()))
  );

module.exports = {
  genericError: customErrorFactory(),
  catchHandler,
  createError: ({ type, message, code, errors }) =>
    customErrorFactory(type, message, code, errors),
  createOpenAPIValidationError: ({ name, message, status, errors }) =>
    customErrorFactory(name, message, status, errors),
  isCustomError: (err) => err instanceof CustomError,
  isOpenAPISpecValidationError: (err) => err.errors && err.status,
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
