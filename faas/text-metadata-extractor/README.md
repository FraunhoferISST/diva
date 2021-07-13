# Text Metadata Extractor 📤

[![version](https://img.shields.io/badge/text--metadata--extractor-2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-metadata-extractor)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-metadata-extractor/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-metadata-extractor/-/commits/master)

This service takes a metadata JSON-file from Apache Tika and provides an sanitized output for `DIVA`.

## Configuration

Environment variables:

|Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE| | a path to the resulting output file |

## Local Development

### Requirements

+ Node.js 14.16.x

### Dependencies

```sh
npm i
```

### Run

```sh
# if environment ist defined in IDE
npm run start

# manually set ENV variables like this
INPUT_FILE=./test.json node app.js
```

## License

Copyright © Fraunhofer ISST 2021
