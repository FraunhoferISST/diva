const fs = require("fs-extra");
const isNumber = require("is-number");
const isString = require("is-string");
const omitBy = require("lodash.omitby");
const readline = require("readline");
const CSVSniffer = require("csv-sniffer")();
const fastCSV = require("fast-csv");
const { transformCSV } = require("./tableTransformation");
const {
  stringCalcMinLength,
  stringCalcMaxLength,
  numberCalcSum,
  numberCalcSumSquared,
  numberCalcSumSquaredError,
  numberCalcMinValue,
  numberCalcMaxValue,
  numberCalcMeanValue,
  numberCalcMeanDeviation,
  numberCalcMeanSquaredErrorValue,
  numberCalcMedianValue,
  numberCalcMedianDeviation,
  numberCalcVariancePopulation,
  numberCalcVarianceSample,
  numberCalcStandardDeviationPopulation,
  numberCalcStandardDeviationSample,
  numberCalcSkewness,
  numberCalcExcessKurtosis,
  numberCalcCoefficientVariation,
  numberCalcQuantileQ1,
  numberCalcQuantileQ2,
  numberCalcQuantileQ3,
} = require("./calcColumnMetrics");

const SNIFFER = new CSVSniffer();
const ROW_READ = 100;
const nullValues = ["n/a", "---"];
const thresholdDataType = 0.9;

/* Global Functions */
const readCSVSample = async (filePath) => new Promise((resolve, reject) => {
  console.log("👁 Read sample to extract meta information");
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
    if (sampleCounter === ROW_READ) {
      rl.close();
    }
  });

  rl.on("error", (e) => {
    reject(`Reading Sample: ${e}`);
  });

  rl.on("close", () => {
    console.log("🏁 Finished reading sample");
    resolve(data);
  });
});

const sniffCSV = async (sample) => {
  console.log("👃 Sniff meta information");
  const sniff = SNIFFER.sniff(sample);
  if (sniff.delimiter === null) {
    sniff.delimiter = ",";
  }
  console.log("🏁 Finished sniffing meta information");
  return sniff;
};

const readHeader = async (filePath, delimiter) => new Promise((resolve, reject) => {
  console.log("👁 Read header");
  const stream = fs.createReadStream(filePath);
  let header = [];

  const csv = fastCSV
    .parseStream(stream, {
      delimiter,
    })
    .on("data", (data) => {
      header = data;
      csv.emit("end");
    })
    .on("error", (e) => {
      reject(`Reding header: ${e}`);
    })
    .on("end", () => {
      console.log("🏁 Finished reading header");
      resolve(header);
    });
});

const readColumn = async (filePath, delimiter, hasHeader) => new Promise((resolve, reject) => {
  console.log("    👁 Read column");

  let column = [];
  const stream = fs.createReadStream(filePath);
  const csv = fastCSV
    .parseStream(stream, {
      delimiter,
    })
    .on("data", (data) => {
      column = data;
      csv.emit("end");
    })
    .on("error", (error) => {
      console.error(error);
      reject(error);
    })
    .on("end", () => {
      /*
      if (hasHeader) {
        column.shift(1);
      }
      */
      column.shift(1); // assume there is a header in first row
      column.pop(); // needed, as transform logik has empty last element NEED FIX
      resolve(column);
    });
});

/* Column-based Functions */
const removeNumbers = (column) => {
  console.log("    🧹 Remove numbers from column");
  for (let i = column.length - 1; i >= 0; i--) {
    if (isNumber(column[i])) {
      column.splice(i, 1);
    }
  }
  return column;
};
const removeStrings = (column) => {
  console.log("    🧹 Remove strings from column");
  for (let i = column.length - 1; i >= 0; i--) {
    if (isString(column[i])) {
      column.splice(i, 1);
    }
  }
  return column;
};
const removeEmptyElements = (column) => {
  console.log("    🧹 Remove empty elements from column");
  for (let i = column.length - 1; i >= 0; i--) {
    if (column[i] === "") {
      column.splice(i, 1);
    }
  }
  return column;
};
const removeNullElements = (column) => {
  console.log("    🧹 Remove null elements from column");
  for (let i = column.length - 1; i >= 0; i--) {
    if (
      !isNumber(column[i])
      && !isString(column[i])
      && nullValues.indexOf(column[i].trim().toLowerCase()) !== -1
    ) {
      column.splice(i, 1);
    }
  }
  return column;
};
const countNumbers = (column) => {
  console.log("    🧮 Count numbers in column");
  let countNumber = 0;
  column.forEach((e) => {
    if (isNumber(e)) countNumber++;
  });
  return countNumber;
};
const countStrings = (column) => {
  console.log("    🧮 Count strings in column");
  let countStrings = 0;
  column.forEach((e) => {
    if (isString(e)) countStrings++;
  });
  return countStrings;
};
const countNullElements = (column) => {
  console.log("    🧮 Count null elements in column");
  let count = 0;
  column.forEach((e) => {
    if (isString(e) && nullValues.indexOf(e.trim().toLowerCase()) !== -1) {
      count += 1;
    }
  });
  return count;
};
const toNativeDataType = (column) => {
  console.log("    💱 Transform values to native data type");
  for (let i = column.length - 1; i >= 0; i--) {
    if (isNumber(column[i])) {
      column.splice(i, 1, parseInt(column[i], 10));
    }
  }
  return column;
};
const guessDataType = (numN, numS, numNull) => {
  console.log("    🤔 Guess data type");
  const tri = (numN + (numS - numNull)) / 100;
  const cleanS = numS - numNull;
  if (numN / tri / 100 >= thresholdDataType) {
    return "number";
  }
  if (cleanS / tri / 100 >= thresholdDataType) {
    return "string";
  }
  return "mixed";
};
const stringsCalcMetrics = (column) => ({
  minCharLength: stringCalcMinLength(column),
  maxCharLength: stringCalcMaxLength(column),
});
const numbersCalcMetrics = (column) => ({
  sum: numberCalcSum(column),
  sumSquared: numberCalcSumSquared(column),
  sumSquaredError: numberCalcSumSquaredError(column),
  minValue: numberCalcMinValue(column),
  maxValue: numberCalcMaxValue(column),
  mean: numberCalcMeanValue(column),
  meanSquaredError: numberCalcMeanSquaredErrorValue(column),
  median: numberCalcMedianValue(column),
  variancePopulation: numberCalcVariancePopulation(column),
  varianceSample: numberCalcVarianceSample(column),
  standardDeviationPopulation: numberCalcStandardDeviationPopulation(column),
  standardDeviationSample: numberCalcStandardDeviationSample(column),
  meanDeviation: numberCalcMeanDeviation(column),
  medianDeviation: numberCalcMedianDeviation(column),
  skewness: numberCalcSkewness(column),
  excessKurtosis: numberCalcExcessKurtosis(column),
  coefficientVariation: numberCalcCoefficientVariation(column),
  quantileQ1: numberCalcQuantileQ1(column),
  quantileQ2: numberCalcQuantileQ2(column),
  quantileQ3: numberCalcQuantileQ3(column),
});
const calculateFrequency = (column) => {
  console.log("    📊 Calculate distribution of values");
  const freq = [];

  for (let i = 0; i < column.length; ++i) {
    let found = false;

    for (let j = 0; j < freq.length; j++) {
      if (column[i] === freq[j].token) {
        freq[j].count++;
        found = true;
        break;
      }
    }

    if (!found && freq.length < 50) {
      freq.push({
        token: column[i],
        count: 1,
      });
    } else if (!found && freq.length === 50) {
      return [];
    }
  }

  return freq;
};

/* Main Functions */
const calculateMetrics = async (filePath) => {
  console.log("🖥 Start calculating metrics...");
  const sample = await readCSVSample(filePath);
  const sniffRes = await sniffCSV(sample);
  const { delimiter } = sniffRes;
  const header = await readHeader(filePath, delimiter); // assume, title is in first row
  const tFiles = await transformCSV(filePath, delimiter); // array of paths to column as row
  const statistics = [];
  let numberOfMaxRows = 0;
  let numberOfAllRows = 0;

  for (let i = 0; i < tFiles.length; ++i) {
    console.log(`👁 Work with column ${i}`);

    const tmp = {};
    let numStat = {};
    let stringStat = {};
    let column = [];

    try {
      column = await readColumn(tFiles[i], delimiter, false);
      removeEmptyElements(column);
      toNativeDataType(column);
    } catch (e) {
      console.log(
        `    ⛔ Error reading column. Using empty array as fallback. ${e}`,
      );
      column = [];
    }

    // program logic
    tmp.title = header[i];
    if (column.length > numberOfMaxRows) numberOfMaxRows = column.length;
    tmp.columnIndex = i;
    tmp.numberOfNumbers = countNumbers(column);
    tmp.numberOfStrings = countStrings(column);
    tmp.numberOfNullElements = countNullElements(column);
    tmp.numberOfRows = tmp.numberOfNumbers + tmp.numberOfStrings;
    numberOfAllRows += tmp.numberOfRows;
    tmp.dataType = guessDataType(
      tmp.numberOfNumbers,
      tmp.numberOfStrings,
      tmp.numberOfNullElements,
    );

    if (tmp.numberOfNumbers > 0) {
      console.log("    🖥 Calculate number metrics...");
      const numbersOnly = removeStrings(column);
      tmp.frequencyNumbers = calculateFrequency(numbersOnly);
      numStat = numbersCalcMetrics(numbersOnly);
      numStat = omitBy(
        numStat,
        (value) => isNaN(value) || value == null || (!isNaN(value) && !isFinite(value)),
      );
    }

    if (tmp.numberOfStrings > 0) {
      /* FIX: as we work on ref, we need a fresh column array */
      try {
        column = await readColumn(tFiles[i], delimiter, false);
        removeEmptyElements(column);
        toNativeDataType(column);
      } catch (e) {
        console.log(
          `    ⛔ Error reading column. Using empty dummy as fallback. ${e}`,
        );
        column = [];
      }

      console.log("    🖥 Calculate number metrics...");
      const stringsOnly = removeNullElements(removeNumbers(column));
      tmp.frequencyStrings = calculateFrequency(stringsOnly);
      stringStat = stringsCalcMetrics(stringsOnly);
    }
    const result = {
      ...tmp,
      ...numStat,
      ...stringStat,
    };
    statistics.push(result);
    console.log(`    🏁 Finished calculations of column ${i}`);
  }

  // calculate metrics that are depending on global values
  console.log("🌍 Calculate global metrics");

  for (let i = 0; i < statistics.length; ++i) {
    statistics[i].completeness = statistics[i].numberOfRows / numberOfMaxRows;
    statistics[i].maxNumberOfRows = numberOfMaxRows;
  }

  const sumOfAllMaxRows = statistics.length * numberOfMaxRows;

  return {
    tableCompleteness: numberOfAllRows / sumOfAllMaxRows,
    maxNumberOfRows: numberOfMaxRows,
    numberOfColumns: statistics.length,
    columnStatistics: statistics.map((columnResult) => ({
      ...columnResult,
      id: `col#${columnResult.columnIndex}#${columnResult.title}`,
    })),
  };
};

const processFile = async (filePath) => {
  return calculateMetrics(filePath);
};

module.exports = {
  processFile,
};
