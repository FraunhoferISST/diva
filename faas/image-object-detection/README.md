# Image Object Detection 🕵️

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Fimage-object-detection%2Fpackage.json)

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

Copyright © Fraunhofer ISST 2022
