export default (statistics) => {
  const {
    variancePopulation,
    sum,
    skewness,
    excessKurtosis,
    coefficientVariation,
    standardDeviationPopulation,
    standardDeviationSample,
    mean,
  } = statistics;
  const stats = [
    variancePopulation,
    sum,
    skewness,
    excessKurtosis,
    coefficientVariation,
    standardDeviationPopulation,
    standardDeviationSample,
    mean,
  ];
  const titles = [
    "Variance Population",
    "Sum",
    "Skewness",
    "Excess Kurtosis",
    "Coefficient Variation",
    "Standard Deviation Population",
    "Standard Deviation Sample",
    "Mean",
  ];
  return stats
    .map((stat, index) => ({
      title: titles[index],
      value: stat,
    }))
    .filter((s) => s.value);
};
