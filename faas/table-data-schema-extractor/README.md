# Table Data Schema Extractor 📤

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Ftable-data-schema-extractor%2Fpackage.json)

This service gets a table data file with mimeType `text/csv` as input, extracts its content and provides the column headers as `.json` file output.

## Accepted MIME Types

+ `text/csv`

## Configuration

Environment variables:

|Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE    |  | a path to the input file to be analyzed |
| OUTPUT_FILE  | | a path to the resulting output file |

## Local Development

### Requirements

+ `NodeJS:14.16.x`

### Dependencies

```sh
npm i
```

### Run

```sh
#do not forget to set environment variables first!!!
npm run start

# or
INPUT_FILE=table.csv OUTPUT_FILE=result.json node app.js
```

## License

Copyright © Fraunhofer ISST 2021
