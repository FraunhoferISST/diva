const fs = require("fs-extra");

const mapResultProperties = (metadata) => {
  const result = {
    byteSize: parseInt(metadata["Content-Length"], 10),
  };
  if (metadata["Content-Encoding"])
    result.characterEncoding = metadata["Content-Encoding"];
  if (metadata["dcterms:created"])
    result.fileCreated = metadata["dcterms:created"];
  if (metadata["dcterms:modified"])
    result.fileModified = metadata["dcterms:modified"];
  if (metadata["Last-Save-Date"])
    result.fileLastSaveDate = metadata["Last-Save-Date"];

  return result;
};

const processFile = async (filePath) => {
  const metadata = JSON.parse(fs.readFileSync(filePath).toString());
  return mapResultProperties(metadata);
};

module.exports = {
  processFile,
};
