# Language Guesser 🈹

[![version](https://img.shields.io/badge/text--language--guesser-v2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/drm)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-language-guesser/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-language-guesser/-/commits/master)

This service gets a plain text file as input and tries to guess the language the text is written in. It will return the top three languages as array with scoring. The JSON result is written to the output file.

## Accepted MIME Types

+ `text/plain`

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file

## Run

```sh
# if environment ist defined in IDE
npm run start

# manually set ENV variables
INPUT_FILE=./test.txt OUTPUT_FILE=./test_output.json node app.js
```

## Example Output

```json
{
    "languages":[
        {
            "alpha3":"eng",
            "alpha2":"en",
            "language":"English",
            "score":1
        },
        {
            "alpha3":"dan",
            "alpha2":"da",
            "language":"Danish",
            "score":0.9772212178456879
        },
        {
            "alpha3":"fra",
            "alpha2":"fr",
            "language":"French",
            "score":0.9748043455936264
        }
    ]
}
```

## License

Copyright © Fraunhofer ISST 2021
