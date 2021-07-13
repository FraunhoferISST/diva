const fs = require("fs-extra");
const readline = require("readline");
const CSVSniffer = require("csv-sniffer")();

const sniffer = new CSVSniffer();
const rowRead = 100; // read 100 rows as sample

const sniffContent = (filePath) =>
  new Promise((resolve) => {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let sampleCounter = 0;
    let data = "";

    rl.on("line", (line) => {
      sampleCounter += 1;
      data += `${line}\n`;
      if (sampleCounter === rowRead) {
        rl.close();
      }
    });

    rl.on("close", () => {
      resolve(sniffer.sniff(data));
    });
  });

const sanitizeData = (sniffRes) => {
  if (sniffRes.hasHeader) {
    return sniffRes.labels;
  }
  return sniffRes.records[0];
};

const extractSchema = async (path) => {
  const sniffRes = await sniffContent(path);
  /**
   * It is currently not possible to determine if headers are present
   * We assume, that the first line contains headers
   */
  const headers = sanitizeData(sniffRes);
  const columnHeaders = headers.map((header, index) => ({
    name: header,
    id: `header#${index}#${header}`,
  }));
  return {
    tableSchema: columnHeaders,
    keywords: headers,
  };
};

const processFile = async (filePath) => extractSchema(filePath);

module.exports = { processFile };
