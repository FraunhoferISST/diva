# Text Metadata Extractor 📤

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Ftext-metadata-extractor%2Fpackage.json)

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
