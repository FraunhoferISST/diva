/* Dependencies ********************************************************************************* */
const fs = require("fs");
const math = require("mathjs");
const BitSet = require("bitset");
const shannonEntropy = require("binary-shannon-entropy");
const pearson = require("pearson");
const compare = require("hamming-distance");

const pearsonSeed =
  "e61c655407478f50a1c05c8cc66f20922eda1ab1e00323edcd453ef38ef0f5b268bf5524d484880ad5b57adcf1efe3305680fb5ea9d8900f662c35b3ae7ccc154d98abbb75aca471ff4f216abdbea52b8ae2432aee8d2d05fef9f7517da0179dcec8fdb66d326186f227a7410619029438ded19642b970d7b0184c2f7279592958c1cff6d63637fcbad3af09647bc3aaa39ce43b5dc96ce8c57ebc73ec5b313c443d74b82204ddea1df439e567a80dc7d212143a52348b8595cb5a91834ef8a2faebe982164ac2874662b71126695393dfdbe7ca5f3f1bd0d94960e1019ab4137810287776ad0048c46b9b4b7f080c89a625576e9e0b9f970e9933631e1f4081";
const seed = Buffer.from(pearsonSeed, "hex");

const defaultOptions = {
  slidingWindowSize: 4,
  entropyThreshold: 0,
  hashSizeBits: 256,
};

const calcPearson8Bit = (word) => pearson(word, 1, seed);

const readFileToBuffer = async (filePath) =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err)
        reject(
          new Error(
            "The file content can not be extracted or no content at all"
          )
        );
      resolve(data);
    });
  });

const calcSimilarityHash = (fileBuf, options) => {
  const acc = new Array(options.hashSizeBits).fill(0);
  const bs = new BitSet();
  bs.setRange(0, options.hashSizeBits - 1, 0);

  let tmpBuf = fileBuf;

  while (tmpBuf.length >= options.slidingWindowSize) {
    const windowBuff = tmpBuf.slice(0, options.slidingWindowSize);
    if (shannonEntropy(windowBuff) >= options.entropyThreshold) {
      const h = calcPearson8Bit(windowBuff);
      acc[h.readUIntBE(0, 1)] += 1;
    }
    tmpBuf = tmpBuf.slice(1);
  }

  const avg = math.mean(acc);
  acc.forEach((e, i) => {
    if (e > avg) {
      bs.set(i, 1);
    }
  });

  return bs.toString(16).padStart(options.hashSizeBits / 4, "0");
};

async function calculateHash(filePath, options = defaultOptions) {
  return calcSimilarityHash(await readFileToBuffer(filePath), options);
}

const calcHashFromString = (str, options = defaultOptions) =>
  calcSimilarityHash(Buffer.from(str, "utf8"), options);

function getHexStrDistance(h1, h2) {
  return compare(Buffer.from(h1, "hex"), Buffer.from(h2, "hex"));
}

module.exports = {
  calculateHash,
  calcHashFromString,
  getHexStrDistance,
};
