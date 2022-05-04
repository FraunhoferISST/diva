# Text Core Phrase Extractor 💬

![GitHub](https://img.shields.io/badge/version-v4.1.0-green)

This service accepts a `text/plain` file as input, extracts its content and delivers the core phrases as output. A set of different algorithms is available. For more details you need to lookup the corresponding papers. Number of sentences to be extracted and language of the text can be set using ENV variables.

## Configuration

### Environment variables 🌍

|Name|Default|Description|
|---|---|---|
|INPUT_FILE||A path to the directory with input file to be analyzed|
|OUTPUT_FILE||A path to the resulting output file|
|LANG|en|A alpha2 text language name|
|NUMBER_SENTENCES|10|Number of sentences to be extracted by each algorithm|
|ALGORITHMS|`["LSA", "LUHN"]`|Algorithms to be applied|

> **Warning**: Currently the language of a text is extracted automatically. Setting `LANG` has no effect. This could change in future versions!

### Available Languages 💬

|Name|Alpha2 Code (ENV)|
|---|---|
|english|en|
|german|de|
|czech|cs|
|french|fr|
|slovak|sk|
|japanese|ja|
|portuguese|pt|
|spanish|es|

### Available Algorithms 🧙

|Name|ENV|Description|
|---|---|---|
| Latent Semantic Analysis | LSA | A generic text summarization method which uses the latent semantic analysis technique to identify semantically important sentences.|
| Luhn | LUHN | Statistical information derived from word frequency and distribution is used by the machine to compute a relative measure of significance, first for individual words and then for sentences. Sentences scoring highest in significance are extracted.|
| LexRank | LEXRANK | Graph-based Lexical Centrality as Salience in Text Summarization. A stochastic graph-based method for computing relative|
| TextRank | TEXTRANK | A graph-based ranking model for text processin|
| SumBasic | SUMBASIC | A system that produces generic multi-document summaries. Its design is motivated by the observation that words occurring frequently in the document cluster occur with higher probability in the human summaries than words occurring less frequently.|
| Kullback-Lieber | KL | KL-Divergence, a measure of the difference between two probability distributions, is used to select sentences.|
| Reduction | REDUCTION | Graph-based summarization, where a sentence salience is computed as the sum of the weights of its edges to other sentences. The weight of an edge between two sentences is computed in the same manner as TextRank.|

## Local Development

### Requirements

- **Python** >=3.8.x

### Dependencies

```bash
pip3 install -r ./requirements.txt
python3 -c "import nltk; nltk.download('punkt')"
```

### Run

```bash
# if environment ist defined in IDE
python summerizer.py
```

## Output Example

```json
{
  "chorePhrases": [
    {
      "algorithm": "LSA",
      "sentences": [
          "first sentence",
          "second sentence",
          ...
      ]
    },
    ...
  ]
}
```

## License

Copyright © Fraunhofer ISST 2021
