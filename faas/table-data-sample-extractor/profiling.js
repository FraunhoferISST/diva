const fs = require("fs-extra");
const readline = require("readline");
const CSVSniffer = require("csv-sniffer")();

const sniffer = new CSVSniffer();
const rowRead = 100; // read 100 rows as sample

const sniffCSV = async (filePath) =>
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

const sanitizeSample = (sniffRes) => sniffRes.records.slice(1, 20);

const extractSample = async (path) => {
  const sniffRes = await sniffCSV(path);
  if (sniffRes.delimiter === null) {
    console.warn(
      "Parsing Error: No delimiter identified. I can not extract a sample for you!"
    );
    return false;
  }
  return { tableSample: sanitizeSample(sniffRes) };
};

const processFile = async (filePath) => extractSample(filePath);

module.exports = { processFile };
