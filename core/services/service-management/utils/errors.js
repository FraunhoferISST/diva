const { customErrorFactory, catchHandler } = require("@diva/common/Error");

module.exports = {
  catchHandler,
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
