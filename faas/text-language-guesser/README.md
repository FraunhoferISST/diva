# Language Guesser 🈹

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Ftext-language-guesser%2Fpackage.json)

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

Copyright © Fraunhofer ISST 2022
