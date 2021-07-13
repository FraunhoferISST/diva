# Table Data Schema Extractor 📤

[![version](https://img.shields.io/badge/table--data--schema--extractor-2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-schema-extractor)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-schema-extractor/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-schema-extractor/-/commits/master)

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
