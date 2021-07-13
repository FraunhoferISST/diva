const fs = require("fs");
const tmp = require("tmp-promise");
const fastCSV = require("fast-csv");

const transformCSV = async (filePath, delimiter) => new Promise((resolve, reject) => {
  console.log("💱 Transform table data");

  const stream = fs.createReadStream(filePath);
  const pathsToColumnFiles = [];
  let counter = 0;
  fastCSV
    .parseStream(stream, {
      delimiter,
    })
    .on("data", (data) => {
      if (pathsToColumnFiles.length < data.length) {
        for (let i = 0; i < data.length; ++i) {
          if (typeof pathsToColumnFiles[i] === "undefined") {
            pathsToColumnFiles[i] = tmp.fileSync().name;
          }
        }
      }

      for (let i = 0; i < data.length; ++i) {
        fs.appendFileSync(pathsToColumnFiles[i], `${data[i]}${delimiter}`);
      }
      counter++;
      if (counter % 10000 === 0) {
        console.log(`🏁 Finished transforming ${counter} lines`);
      }
    })
    .on("error", (error) => {
      reject(error);
    })
    .on("end", () => {
      resolve(pathsToColumnFiles);
    });
});

module.exports = {
  transformCSV,
};
