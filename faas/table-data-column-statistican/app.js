const fs = require("fs-extra");
const { processFile } = require("./profiling");

const analyze = async () => {
  const result = await processFile(process.env.INPUT_FILE);
  fs.writeFileSync(process.env.OUTPUT_FILE, JSON.stringify(result));
  return true;
};
analyze()
  .then(() => console.log("🚀 success"))
  .catch((e) => {
    console.error(`⛔ ${e}`);
    process.exit(1);
  });
