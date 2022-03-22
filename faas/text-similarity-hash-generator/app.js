const fs = require("fs-extra");
const { calculateHash } = require("./similarityHash");

const analyze = async () => {
  const result = await calculateHash(process.env.INPUT_FILE);
  fs.writeFileSync(
    process.env.OUTPUT_FILE,
    JSON.stringify({
      textContentSimilarityHash: result,
    })
  );
  return true;
};
analyze()
  .then(() => console.log("success"))
  .catch((e) => console.error(e));
