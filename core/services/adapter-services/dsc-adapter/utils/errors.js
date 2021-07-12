const { supportedDistributions } = require("./utils");

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
    err instanceof CustomError ||
    ("type" in err && "code" in err && "message" in err && "errors" in err),
  isOpenAPISpecValidationError: (err) => err.errors && err.status,
  createOpenAPIValidationError: ({ name, message, status, errors }) =>
    customErrorFactory(name, message, status, errors),
  createError: ({ type, message, code, errors }) =>
    customErrorFactory(type, message, code, errors),
  unsupportedDistributionsError: customErrorFactory(
    "UnsupportedDistributions",
    `The resource must have one of the supported distributions: ${supportedDistributions.join(
      ", "
    )}`,
    406
  ),
  resourceNotFoundError: customErrorFactory(
    "ResourceNotFound",
    "The resource with the provided id can not be found",
    404
  ),
  notOfferedError: customErrorFactory(
    "NotOffered",
    "The resource is not offered on IDS Connector",
    404
  ),
  resourcePatchError: customErrorFactory(
    "ResourcePatch",
    "Can not patch resource, changes on IDS are not applied",
    500
  ),
  alreadyOfferedError: customErrorFactory(
    "AlreadyOffered",
    "The resource already have an offer on DSC",
    409
  ),
};
