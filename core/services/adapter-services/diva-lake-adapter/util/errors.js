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

module.exports = {
  isCustomError: (err) =>
    err instanceof CustomError || (err.code && err.type && err.message),
  isOpenAPISpecValidationError: (err) => err.errors && err.status,
  createError: ({ type, message, code, errors }) =>
    customErrorFactory(type, message, code, errors),
  createOpenAPIValidationError: ({ name, message, status, errors }) =>
    customErrorFactory(name, message, status, errors),
};
