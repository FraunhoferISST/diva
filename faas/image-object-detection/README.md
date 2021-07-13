# Image Object Detection 🕵️

[![version](https://img.shields.io/badge/image--object--detection-2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-object-detection)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-object-detection/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/image-object-detection/-/commits/master)

This service gets an image file as input and provides the recognized objects as output.
The produced JSON result is written to the output file.

## Accepted MIME Types

+ `image/jpeg`

## Requirements

+ Node.js 13.x.x
+ Running container from [codait/max-object-detector](https://hub.docker.com/r/codait/max-object-detector) image

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | a path to the resulting output file |
| IBM_HOST | max-object-detector |  IBM service host |
| IBM_PORT | 5000  | IBM service port |

## License

Copyright © Fraunhofer ISST 2021
