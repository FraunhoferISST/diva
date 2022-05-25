# Table Data Sample Extractor 📤

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Ftable-data-sample-extractor%2Fpackage.json)

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
