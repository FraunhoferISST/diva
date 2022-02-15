const { logger: log } = require("../logger");

const retry = async (
  fn,
  retriesLeft = 5,
  interval = 200,
  exponential = true
) => {
  try {
    return await fn();
  } catch (e) {
    if (retriesLeft) {
      log.warn(
        `Execution failed with error: ${e.toString()}. Retrying failed execution, retires left: ${retriesLeft}`,
        {
          functionName: fn.name || "anonymous",
          retriesLeft,
          interval: exponential ? interval * 2 : interval,
        }
      );
      await new Promise((r) =>
        setTimeout(r, exponential ? interval * 2 : interval)
      );
      return retry(
        fn,
        retriesLeft - 1,
        exponential ? interval * 2 : interval,
        exponential
      );
    }
    throw new Error(`Maximum retries exceeded for ${fn.name}`);
  }
};

module.exports = retry;
