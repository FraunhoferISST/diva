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
  customErrorFactory,
  catchHandler,
  createError: ({ type, message, code, errors }) =>
    customErrorFactory(type, message, code, errors),
  createOpenAPIValidationError: ({ name, message, status, errors }) =>
    customErrorFactory(name, message, status, errors),
  isCustomError: (err) => err instanceof CustomError,
  isOpenAPISpecValidationError: (err) => err.errors && err.status,
  entityAlreadyExistsError: customErrorFactory(
    "EntityAlreadyExists",
    "Entity with the provided data already exists",
    409
  ),
  entityNotFoundError: customErrorFactory(
    "EntityNotFound",
    "Entity with the given id not found",
    404
  ),
};
