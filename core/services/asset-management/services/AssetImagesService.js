const { Readable } = require("stream");
const { GridFSBucket } = require("mongodb");
const generateUuid = require("@diva/common/generateUuid");
const { assetsMongoDbConnector } = require("../utils/mongoDbConnectors");
const {
  imageNotFoundError,
  wrongImageFormatError,
} = require("../utils/errors");

const MONGO_GFS_ASSET_IMAGE_BUCKET_NAME =
  process.env.MONGO_GFS_ASSET_IMAGE_BUCKET_NAME || "assetImages";

const isSupportedMimeType = (mimeType) =>
  ["image/png", "image/jpeg"].includes(mimeType);

const getImageObject = async (id) => {
  const images = await assetsMongoDbConnector.gfs
    .find({ _id: id }, { limit: 1 })
    .toArray();
  return images[0];
};

const imageExists = async (id) => !!(await getImageObject(id));

const writeImage = async (file, id = generateUuid("image")) => {
  const { mimetype, buffer, originalname } = file;
  return new Promise((resolve, reject) => {
    const readable = Readable.from(buffer);
    const writeStream = assetsMongoDbConnector.gfs.openUploadStream(
      originalname,
      {
        id,
        contentType: mimetype,
      }
    );
    const imageId = writeStream.id.toString();
    readable
      .pipe(writeStream)
      .on("error", (error) => reject(error))
      .on("finish", () => resolve(imageId));
  });
};

class AssetImagesService {
  async init() {
    assetsMongoDbConnector.gfs = new GridFSBucket(
      assetsMongoDbConnector.database,
      {
        bucketName: MONGO_GFS_ASSET_IMAGE_BUCKET_NAME,
      }
    );
  }

  async addImage(file) {
    if (!isSupportedMimeType(file.mimetype)) {
      throw wrongImageFormatError;
    }
    return writeImage(file);
  }

  async getImage(id) {
    const existingImage = await getImageObject(id);
    if (!existingImage) {
      throw imageNotFoundError;
    }
    return {
      stream: assetsMongoDbConnector.gfs.openDownloadStream(id),
      contentType: existingImage.contentType,
    };
  }

  async putImage(id, file) {
    if (!(await imageExists(id))) {
      throw imageNotFoundError;
    }
    if (!isSupportedMimeType(file.mimetype)) {
      throw wrongImageFormatError;
    }
    await assetsMongoDbConnector.gfs.delete(id);
    return writeImage(file);
  }

  async deleteImage(id) {
    if (!(await imageExists(id))) {
      throw imageNotFoundError;
    }
    const documents = await assetsMongoDbConnector.gfs.find({ _id: id }).toArray();

    return Promise.all(documents.map((doc) =>{
      console.log(doc._id)
      return assetsMongoDbConnector.gfs.delete(doc._id)
    }))

    // return assetsMongoDbConnector.gfs.delete(id)

  }
}

module.exports = new AssetImagesService();
