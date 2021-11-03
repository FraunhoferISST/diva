const cliProgress = require("cli-progress");
const chalk = require("chalk");

module.exports = new cliProgress.MultiBar({
  format: `{title} ${chalk.blue("{bar}")} {value}/{total}`,
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  clearOnComplete: false,
  stopOnComplete: true,
});
