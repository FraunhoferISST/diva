# Table Data Sample Extractor 📤

[![version](https://img.shields.io/badge/table--data--sample--extractor-3.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-sample-extractor)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-sample-extractor/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-sample-extractor/-/commits/master)

This service gets a `text/csv` file as input and provides a sample of max 20 rows as output to give a possible user an insight into the data. The produced JSON result is written to the output file.

## Accepted mime types

+ `text/csv`

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | A path to the resulting output file |

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
