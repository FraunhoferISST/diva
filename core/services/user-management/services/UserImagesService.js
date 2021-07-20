const { Readable } = require("stream");
const generateUuid = require("@diva/common/generateUuid");
const { db } = require("../utils/mongoDbConnectors");
const {
  imageNotFoundError,
  wrongImageFormatError,
} = require("../utils/errors");

const isSupportedMimeType = (mimeType) =>
  ["image/png", "image/jpeg"].includes(mimeType);

const getImageObject = async (id) => {
  const images = await db.gfs.find({ _id: id }, { limit: 1 }).toArray();
  return images[0];
};

const imageExists = async (id) => !!(await getImageObject(id));

const writeImage = async (file, id = generateUuid("image")) => {
  const { mimetype, buffer, originalname } = file;
  return new Promise((resolve, reject) => {
    const readable = Readable.from(buffer);
    const writeStream = db.gfs.openUploadStream(originalname, {
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

class UserImagesService {
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
      stream: db.gfs.openDownloadStream(id),
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
    await db.gfs.delete(id);
    return writeImage(file);
  }

  async deleteImage(id) {
    if (!(await imageExists(id))) {
      throw imageNotFoundError;
    }
    return db.gfs.delete(id);
  }
}

module.exports = new UserImagesService();
