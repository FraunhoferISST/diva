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
  notFoundError: customErrorFactory(
    "NotFound",
    "Data requested not found",
    404
  ),
};
