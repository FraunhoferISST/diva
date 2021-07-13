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
  if (metadata["pdf:docinfo:creator_tool"])
    result.pdfDocinfoCreatorTool = metadata["pdf:docinfo:creator_tool"];
  if (metadata["pdf:docinfo:producer"])
    result.pdfDocinfoProducer = metadata["pdf:docinfo:producer"];
  if (metadata["pdf:encrypted"])
    result.pdfEncrypted = metadata["pdf:encrypted"] === "true";
  if (metadata["pdf:PDFVersion"])
    result.pdfVersion = metadata["pdf:PDFVersion"];
  if (metadata["xmpTPg:NPages"])
    result.documentNumberOfPages = parseInt(metadata["xmpTPg:NPages"], 10);
  return result;
};

const processFile = async (filePath) => {
  const content = fs.readFileSync(filePath);
  return mapResultProperties(JSON.parse(content.toString()));
};

module.exports = {
  processFile,
};
