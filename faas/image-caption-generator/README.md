# Image Caption Generator 🖼️

[![version](https://img.shields.io/badge/image--caption--generator-2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-caption-generator)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-caption-generator/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-caption-generator/-/commits/master)

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

Copyright © Fraunhofer ISST 2021
