const { jStat } = require("jstat");

const stringCalcMinLength = (column) => {
  try {
    let min = Number.MAX_VALUE;
    for (let i = 0; i < column.length; ++i) {
      if (column[i].length < min) {
        min = column[i].length;
      }
    }
    return min;
  } catch (e) {
    console.log(
      `    ⛔ Error calculating smallest string size. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const stringCalcMaxLength = (column) => {
  try {
    let max = 0;
    for (let i = 0; i < column.length; ++i) {
      if (column[i].length > max) {
        max = column[i].length;
      }
    }
    return max;
  } catch (e) {
    console.log(
      `    ⛔ Error calculating biggest string size. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcSum = (column) => {
  try {
    return jStat.sum(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating sum of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcSumSquared = (column) => {
  try {
    return jStat.sumsqrd(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating sum squared of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcSumSquaredError = (column) => {
  try {
    return jStat.sumsqerr(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating sum squared error of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMinValue = (column) => {
  try {
    return jStat.min(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating minimal value of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMaxValue = (column) => {
  try {
    return jStat.max(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating maximal value of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMeanValue = (column) => {
  try {
    return jStat.mean(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating mean value of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMeanDeviation = (column) => {
  try {
    return jStat.meandev(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating mean deviation of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMeanSquaredErrorValue = (column) => {
  try {
    return jStat.meansqerr(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating mean squared error value of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMedianValue = (column) => {
  try {
    return jStat.median(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating median value of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcMedianDeviation = (column) => {
  try {
    return jStat.meddev(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating median deviation of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcVariancePopulation = (column) => {
  try {
    return jStat.variance(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating variance population of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcVarianceSample = (column) => {
  try {
    return jStat.variance(column, true);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating variance sample of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcStandardDeviationPopulation = (column) => {
  try {
    return jStat.stdev(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating standard deviation population of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcStandardDeviationSample = (column) => {
  try {
    return jStat.stdev(column, true);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating standard deviation of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcSkewness = (column) => {
  try {
    return jStat.skewness(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating skewness of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcExcessKurtosis = (column) => {
  try {
    return jStat.kurtosis(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating excess kurtosis of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcCoefficientVariation = (column) => {
  try {
    return jStat.coeffvar(column);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating coefficient variation of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcQuantileQ1 = (column) => {
  try {
    return jStat.percentile(column, 0.25);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating Quantile Q1 of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcQuantileQ2 = (column) => {
  try {
    return jStat.percentile(column, 0.5);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating Quantile Q2 of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};
const numberCalcQuantileQ3 = (column) => {
  try {
    return jStat.percentile(column, 0.75);
  } catch (e) {
    console.log(
      `    ⛔ Error calculating Quantile Q3 of column. Setting fallback value '0'. ${e}`,
    );
    return 0;
  }
};

module.exports = {
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
};
