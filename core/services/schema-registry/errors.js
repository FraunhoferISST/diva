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
  createError: ({ type, message, code, errors }) =>
    customErrorFactory(type, message, code, errors),
  schemaNotFoundError: customErrorFactory(
    "NotFound",
    "Can not find schema with the provided name",
    404
  ),
};
