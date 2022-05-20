# Image Caption Generator 🖼️

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Fimage-caption-generator%2Fpackage.json)

This service gets an image file as input and provides the generic image caption as output.
The produced JSON result is written to the output file.

## Accepted mime types

+ `image/jpeg`

## Requirements

+ Node.js 14.16.x
+ Running container from [codait/max-image-caption-generator](https://hub.docker.com/r/codait/max-image-caption-generator) image

### Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | a path to the resulting output file |
| IBM_HOST | max-image-caption-generator  |  IBM service host |
| IBM_PORT | 5000 | IBM service port |

## License

Copyright © Fraunhofer ISST 2022
