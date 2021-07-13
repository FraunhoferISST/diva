# Text Statistican 🧬

[![version](https://img.shields.io/badge/text--statistican-2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/drm)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-statistican/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-statistican/-/commits/master)

A simple service to extract statistical metrics from a text file.

## Accepted MIME Types

+ `text/plain`

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file

## Local Development

### Requirements

+ Node.js 14.16.x
+ Python 3.8.x

### Dependencies

```sh
npm i
pip3 install -r ./ext/statistics/requirements.txt
python3 -c "import nltk; nltk.download('punkt')"
```

### Run

```sh
# if environment ist defined in IDE
npm run start

# manually set ENV variables
INPUT_FILE=./test.txt OUTPUT_FILE=./test_output.json node app.js
```

## Example Output

```json
{
    "numberOfCharacters":2264,
    "numberOfWords":557,
    "numberOfSentences":20,
    "characterDistribution":[
        {"character":"f","count":51},
        {"character":"a","count":195},
        {"character":"r","count":134},
        {"character":"w","count":44},
        {"character":"y","count":34},
        {"character":"b","count":44},
        {"character":"e","count":283},
        {"character":"h","count":137},
        {"character":"i","count":162},
        {"character":"n","count":160},
        {"character":"d","count":103},
        {"character":"t","count":207},
        {"character":"o","count":159},
        {"character":"m","count":55},
        {"character":"u","count":59},
        {"character":"s","count":124},
        {"character":"c","count":54},
        {"character":"v","count":34},
        {"character":"k","count":23},
        {"character":"l","count":116},
        {"character":"x","count":14},
        {"character":"p","count":33},
        {"character":"g","count":35},
        {"character":"q","count":3},
        {"character":"j","count":1}
    ]
}
```

## License

Copyright © Fraunhofer ISST 2021
