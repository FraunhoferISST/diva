const { performance } = require("perf_hooks");
const path = require("path");
const fs = require("fs");
const jstring = require("jstring");
const { Language } = require("node-nlp");
const { NlpManager } = require("node-nlp");
const natural = require("natural");
const NER = require("ner-promise");

const appRoot = process.cwd();
const SPL = 50; // scentence package limit

/* Path to external tools *********************************************************************** */
const stanfordPath = path.join(appRoot, "ext", "stanford-ner"); // 'stanford-ner.jar'
const classifierEn = "english.muc.7class.distsim.crf.ser.gz";
const classifierDe = "german.conll.germeval2014.hgc_175m_600.crf.ser.gz";

/**
 * Sanatize text by removing double whitespaces and non-ASCII characters
 * @param text
 */
const sanitizeText = (text) => {
  let t = text.replace(/\r?\n|\r/g, " ");
  t = jstring.minifyWhitespace(t);
  return t;
};

/**
 * Language guessing used from node-nlp. Works in almost all cases.
 * @param {String} text: the text of which the language should be guessed
 */
const guessLanguages = (text) => {
  const language = new Language();
  return language.guess(text, null, 3);
};

const extractEntities = (text, language) => {
  const manager = new NlpManager({ languages: language });
  return manager.extractEntities(text);
};

async function extractNamedEntities(text, language) {
  let nerPromise;
  if (language === "de") {
    nerPromise = new NER({
      install_path: stanfordPath,
      jar: "stanford-ner.jar",
      classifier: classifierDe,
    });
  } else {
    nerPromise = new NER({
      install_path: stanfordPath,
      jar: "stanford-ner.jar",
      classifier: classifierEn,
    });
  }
  return nerPromise.process(text);
}

const recognizePersonalData = (entities, namedEntities) => {
  let email = 0;
  let phoneNumber = 0;
  for (let i = 0; i < entities.length; i += 1) {
    const item = entities[i];
    if (item) {
      if (item.entity === "email") {
        email += 1;
      } else if (item.entity === "phonenumber") {
        phoneNumber += 1;
      }
    }
  }

  const organization = namedEntities.ORGANIZATION.length;
  const person = namedEntities.PERSON.length;
  const location = namedEntities.LOCATION.length;

  return {
    numberOfFoundEmails: email,
    numberOfFoundPhoneNumbers: phoneNumber,
    numberOfFoundOrganizations: organization,
    numberOfFoundPersons: person,
    numberOfFoundLocations: location,
  };
};

const percentage = (number, total) => (number / total) * 100;

const evaluatePrivacy = (frequency, totalLength) => {
  let privacy = 0;
  const { email, telephone, organization, person, location } = frequency;

  if (
    percentage(email, totalLength) > 25 ||
    percentage(telephone, totalLength) > 25 ||
    percentage(organization, totalLength) > 25 ||
    percentage(person, totalLength) > 25 ||
    percentage(location, totalLength) > 25
  ) {
    privacy = 100;
  } else if (
    percentage(email, totalLength) >= 1 &&
    percentage(telephone, totalLength) >= 1 &&
    percentage(person, totalLength) >= 1 &&
    percentage(location, totalLength) >= 1
  ) {
    privacy = 100;
  } else if (
    percentage(email, totalLength) > 10 ||
    percentage(telephone, totalLength) > 10 ||
    percentage(organization, totalLength) > 10 ||
    percentage(person, totalLength) > 10 ||
    percentage(location, totalLength) > 10
  ) {
    privacy = 75;
  } else if (
    (percentage(email, totalLength) >= 1 &&
      percentage(telephone, totalLength) >= 1 &&
      percentage(person, totalLength) >= 1) ||
    (percentage(email, totalLength) >= 1 &&
      percentage(telephone, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1) ||
    (percentage(email, totalLength) >= 1 &&
      percentage(person, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1) ||
    (percentage(person, totalLength) >= 1 &&
      percentage(telephone, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1)
  ) {
    privacy = 75;
  } else if (
    (percentage(email, totalLength) >= 1 &&
      percentage(telephone, totalLength) >= 1) ||
    (percentage(email, totalLength) >= 1 &&
      percentage(person, totalLength) >= 1) ||
    (percentage(email, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1) ||
    (percentage(person, totalLength) >= 1 &&
      percentage(telephone, totalLength) >= 1) ||
    (percentage(person, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1) ||
    (percentage(telephone, totalLength) >= 1 &&
      percentage(location, totalLength) >= 1)
  ) {
    privacy = 50;
  } else if (
    percentage(email, totalLength) >= 3 ||
    percentage(telephone, totalLength) >= 3 ||
    percentage(organization, totalLength) >= 3 ||
    percentage(person, totalLength) >= 3 ||
    percentage(location, totalLength) >= 3
  ) {
    privacy = 10;
  } else if (
    percentage(email, totalLength) >= 1 ||
    percentage(telephone, totalLength) >= 1 ||
    percentage(organization, totalLength) >= 1 ||
    percentage(person, totalLength) >= 1 ||
    percentage(location, totalLength) >= 1
  ) {
    privacy = 10;
  } else {
    privacy = 0;
  }
  return privacy;
};

const processFile = async (filePath) => {
  console.log("👁 Reading raw text...");
  let text = fs.readFileSync(filePath);
  if (!text) {
    throw Error(
      "The file text can not be extracted or there is no text at all"
    );
  }

  console.log("🧹 Sanitize raw text...");
  text = sanitizeText(text.toString());

  console.log("🇩🇪 Guessing language...");
  const language = guessLanguages(text)[0].alpha2; // TODO: can this fail?

  console.log("💬 Tokenize into sentences...");
  const tokenizerS = new natural.SentenceTokenizer();
  const sentences = tokenizerS.tokenize(text);

  console.log("💬 Tokenize into words...");
  const tokenizerW = new natural.WordTokenizer();
  const wordCount = tokenizerW.tokenize(text).length;

  console.log("📤 Extract entities...");
  const entities = [];
  const namedEntities = {
    ORGANIZATION: [],
    PERSON: [],
    LOCATION: [],
  };

  const steps = Math.ceil(sentences.length / SPL);
  let currentStep = 0;

  const t0 = performance.now();

  for (let i = 0, j = sentences.length; i < j; i += SPL) {
    const t = performance.now();
    const s = sentences.slice(i, i + SPL).join(" ");
    // eslint-disable-next-line no-await-in-loop
    const e = await extractEntities(s, language);
    // eslint-disable-next-line no-await-in-loop
    const nE = await extractNamedEntities(s, language);
    entities.push(...e.entities);

    if ("ORGANIZATION" in nE) {
      namedEntities.ORGANIZATION.push(...nE.ORGANIZATION);
    }
    if ("PERSON" in nE) {
      namedEntities.PERSON.push(...nE.PERSON);
    }
    if ("LOCATION" in nE) {
      namedEntities.LOCATION.push(...nE.LOCATION);
    }

    const durationStep = performance.now() - t;
    const durationGlobal = performance.now() - t0;

    currentStep += 1;
    console.log(
      `⛏ Finsihed calculating ${currentStep}/${steps} | this step ${(
        durationStep / 1000
      ).toFixed(2)}s | overall steps ${(durationGlobal / 1000).toFixed(2)}s`
    );
  }

  console.log("🖥 Calculate frequency of occurrence and privacy level...");
  const frequency = recognizePersonalData(entities, namedEntities);
  const privacy = evaluatePrivacy(frequency, wordCount);

  const result = {
    personalData: {
      ...frequency,
      evaluatedPrivacyMetric: privacy,
    },
  };

  return result;
};

module.exports = {
  processFile,
};
