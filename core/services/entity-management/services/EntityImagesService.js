const { Readable } = require("stream");
const { GridFSBucket } = require("mongodb");
const generateUuid = require("@diva/common/utils/generateUuid");
const { mongoDbConnector } = require("../utils/mongoDbConnector");
const {
  imageNotFoundError,
  wrongImageFormatError,
} = require("../utils/errors");

const MONGO_GFS_BUCKET_NAME = "entitiesMedia";

const isSupportedMimeType = (mimeType) =>
  ["image/png", "image/jpeg"].includes(mimeType);

const getImageObject = async (id) => {
  const images = await mongoDbConnector.gfs
    .find({ _id: id }, { limit: 1 })
    .toArray();
  return images[0];
};

const imageExists = async (id) => !!(await getImageObject(id));

const writeImage = async (file, id = generateUuid("image")) => {
  const { mimetype, buffer, originalname } = file;
  return new Promise((resolve, reject) => {
    const readable = Readable.from(buffer);
    const writeStream = mongoDbConnector.gfs.openUploadStream(originalname, {
      id,
      contentType: mimetype,
    });
    const imageId = writeStream.id.toString();
    readable
      .pipe(writeStream)
      .on("error", (error) => reject(error))
      .on("finish", () => resolve(imageId));
  });
};

class EntityImagesService {
  async init() {
    mongoDbConnector.gfs = new GridFSBucket(mongoDbConnector.database, {
      bucketName: MONGO_GFS_BUCKET_NAME,
    });
  }

  async getImageById(id) {
    const existingImage = await getImageObject(id);
    if (!existingImage) {
      throw imageNotFoundError;
    }
    return {
      stream: mongoDbConnector.gfs.openDownloadStream(id),
      contentType: existingImage.contentType,
    };
  }

  async addImage(file) {
    if (!isSupportedMimeType(file.mimetype)) {
      throw wrongImageFormatError;
    }
    // Always generate new id for the image to avoid caching inconsistencies
    return writeImage(file);
  }

  async deleteImageById(id) {
    if (!(await imageExists(id))) {
      throw imageNotFoundError;
    }
    return mongoDbConnector.gfs.delete(id);
  }

  async deleteImages(ids) {
    return Promise.all(ids.map((id) => mongoDbConnector.gfs.delete(id)));
  }
}

module.exports = new EntityImagesService();
