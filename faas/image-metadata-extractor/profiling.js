const { ExifImage } = require("exif");
const fs = require("fs");

const extractMetadata = (filePath) =>
  new Promise(
    (resolve, reject) =>
      new ExifImage({ image: filePath }, (error, exifData) => {
        if (error) {
          if (error.code === "NO_EXIF_SEGMENT") {
            console.log("No exif data");
            resolve(null);
          } else {
            console.error(`Error: ${JSON.stringify(error)}`);
            reject(error.message);
          }
        } else {
          resolve(exifData);
        }
      })
  );

const getFileSize = (path) => {
  const stats = fs.statSync(path);
  return stats.size;
};

const mapResultProperties = (metadata) => {
  const result = {
    exif: {
      image: {},
      photo: {},
    },
  };

  if (metadata.image.Make) {
    result.exif.image.make = metadata.image.Make;
  }
  if (metadata.image.Model) {
    result.exif.image.model = metadata.image.Model;
  }
  if (metadata.image.Orientation) {
    result.exif.image.orientation = metadata.image.Orientation;
  }
  if (metadata.image.XResolution) {
    result.exif.image.xResolution = metadata.image.XResolution;
  }
  if (metadata.image.YResolution) {
    result.exif.image.yResolution = metadata.image.YResolution;
  }
  if (metadata.image.ResolutionUnit) {
    result.exif.image.resolutionUnit = metadata.image.ResolutionUnit;
  }
  if (metadata.image.Software) {
    result.exif.image.software = metadata.image.Software;
  }
  if (metadata.image.YCbCrPositioning) {
    result.exif.image.ycbcrPositioning = metadata.image.YCbCrPositioning;
  }
  if (metadata.image.Copyright) {
    result.exif.image.copyright = metadata.image.Copyright;
  }
  if (metadata.exif.ExifImageWidth) {
    result.exif.image.imageWidth = metadata.exif.ExifImageWidth;
  }
  if (metadata.exif.ExifImageHeight) {
    result.exif.image.imageLength = metadata.exif.ExifImageHeight;
  }

  if (metadata.exif.FNumber) {
    result.exif.photo.fNumber = metadata.exif.FNumber;
  }
  if (metadata.exif.ISO) {
    result.exif.photo.iso = metadata.exif.ISO;
  }
  if (metadata.exif.ShutterSpeedValue) {
    result.exif.photo.shutterSpeedValue = metadata.exif.ShutterSpeedValue;
  }
  if (metadata.exif.BrightnessValue) {
    result.exif.photo.brightnessValue = metadata.exif.BrightnessValue;
  }
  if (metadata.exif.Flash) {
    result.exif.photo.flash = metadata.exif.Flash;
  }
  if (metadata.byteSize) {
    result.byteSize = metadata.byteSize;
  }

  return result;
};

const processFile = async (filePath) => {
  const metadata = await extractMetadata(filePath);
  if (!metadata) {
    return {
      exif: {
        image: {},
        photo: {},
      },
      byteSize: getFileSize(filePath),
    };
  }
  metadata.byteSize = getFileSize(filePath);
  return mapResultProperties(metadata);
};

module.exports = {
  processFile,
};
