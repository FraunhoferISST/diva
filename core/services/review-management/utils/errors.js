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
  genericError: customErrorFactory(),
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
  alreadyWroteReviewError: customErrorFactory(
    "UserAlreadyExists",
    "Review for this entity already created from this actor",
    409
  ),
  reviewNotFound: customErrorFactory(
    "UserNotFound",
    "Review with the given id not found",
    404
  ),
  notReviewAuthorError: customErrorFactory(
    "PermissionDenied",
    "Only review authors can modify/delete reviews",
    403
  ),
};
