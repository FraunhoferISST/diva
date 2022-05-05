# Table Data Metadata Extractor 📤

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Ftable-data-metadata-extractor%2Fpackage.json)

This service gets the Apache Tika metadata of a CSV-file as input, extracts its content and provides the file metadata as output. The produced JSON result is written to the output file.

## Accepted mime types

+ `application/json`

## INPUT_FILE Config

Please provide the metadata from Apache Tika as the `INPUT_FILE`.

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE| | a path to the resulting output file |

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
INPUT_FILE=tike_result.json OUTPUT_FILE=result.json node app.js
```

## License

Copyright © Fraunhofer ISST 2021
