const fs = require("fs-extra");
const path = require("path");
const jstring = require("jstring");
const { Language } = require("node-nlp");
const { PythonShell } = require("python-shell");
const tmp = require("tmp-promise");

const appRoot = process.cwd();

const statisticsLanguages = ["de", "en"];

/* Path to external tools *********************************************************************** */
const textStatisticanPath = path.join(appRoot, "ext", "statistics");
const textStatisticanAppName = "text-statistics.py";

const sanitizeText = (text) => {
  let t = text.replace(/\r?\n|\r/g, " ");
  t = jstring.minifyWhitespace(t);
  return t;
};

const guessLanguages = (text) => {
  const language = new Language();
  const guess = language.guess(text, null, 3);
  return guess[0].alpha2;
};

const mapResult = (res) => ({
  numberOfCharacters: res.numberOfCharacters,
  numberOfWords: res.numberOfWords,
  numberOfSentences: res.numberOfSentences,
  characterDistribution: !res.characterDistribution
    ? undefined
    : res.characterDistribution.map((e) => ({
        character: e[0],
        count: e[1],
      })),
});

const stats = async (text, languageAlpha2) => {
  if (statisticsLanguages.indexOf(languageAlpha2) > -1) {
    const { path: tmpPath, cleanup } = await tmp.file();
    await fs.outputFile(tmpPath, text);

    return new Promise((resolve, reject) => {
      const options = {
        mode: "text",
        pythonOptions: ["-u"], // get print results in real-time
        scriptPath: textStatisticanPath,
        args: [tmpPath, languageAlpha2],
      };

      PythonShell.run(textStatisticanAppName, options, (err, results) => {
        cleanup();

        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(results));
        }
      });
    });
  }
  return [];
};

const processFile = async (filePath) => {
  let content = fs.readFileSync(filePath);
  if (!content) {
    throw Error("The file content can not be extracted or no content at all");
  }
  content = sanitizeText(content.toString());
  const languageAlpha2 = guessLanguages(content);
  const res = await stats(content, languageAlpha2);
  return mapResult(res);
};

module.exports = {
  processFile,
};
