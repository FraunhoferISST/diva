const sharp = require("sharp");

const generateThumbnail = async (filePath) => {
  const buffer = await sharp(filePath)
    .resize({
      width: 200,
      height: 200,
      fit: sharp.fit.inside,
      position: sharp.strategy.entropy,
    })
    .toBuffer();
  return buffer.toString("base64");
};

const processFile = async (filePath) => ({
  imageThumbnail: await generateThumbnail(filePath),
});

module.exports = { processFile };
