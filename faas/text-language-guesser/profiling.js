const fs = require('fs');
const jstring = require('jstring');
const { Language } = require('node-nlp');

/**
 * Sanatize text by removing double whitespaces and non-ASCII characters
 * @param text
 */
const sanitizeText = (text) => {
  let t = text.replace(/\r?\n|\r/g, ' ');
  t = jstring.minifyWhitespace(t);
  return t;
};

/**
 * Language guessing used from node-nlp. Works in almost all cases.
 * @param {String} text: the text of which the language should be guessed
 */
const guessLanguages = (text) => {
  const language = new Language();
  return language.guess(
    text,
    null,
    3,
  );
};


const processFile = async (filePath) => {
  const content = fs.readFileSync(filePath);
  if (!content) {
    throw Error('The file content can not be extracted or no content at all');
  }
  return guessLanguages(sanitizeText(content.toString()));
};

module.exports = {
  processFile,
};
