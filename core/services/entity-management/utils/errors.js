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
  nodeNotFoundError: customErrorFactory(
    "NodeNotFound",
    "Node for the given entity id not found",
    404
  ),
  edgeAlreadyExistsError: customErrorFactory(
    "EdgeAlreadyExists",
    "The edge type in between given entities already exists",
    409
  ),
  nodeAlreadyExistsError: customErrorFactory(
    "NodeAlreadyExists",
    "The node with the given id already exists",
    409
  ),
  edgeNotFoundError: customErrorFactory(
    "EdgeNotFound",
    "Edge withe the given id not found",
    404
  ),
};
