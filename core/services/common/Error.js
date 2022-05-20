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
  isCustomError: (err) =>
    err instanceof CustomError || (err.code && err.message && err.type),
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
  notFoundError: customErrorFactory(
    "NotFound",
    "Requested data not found",
    404
  ),
  imagesLimitError: customErrorFactory(
    "ImagesLimitError",
    "Entity images limit exceeded. Entity can not have more than 15 images",
    406
  ),
  AccessDeniedError: customErrorFactory(
    "AccessDeniedError",
    "There is no policy that allows the current request",
    403
  ),
};
