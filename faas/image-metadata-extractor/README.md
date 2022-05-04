# Image Metadata Extractor 📤

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/FraunhoferISST/diva?color=green&filename=faas%2Fimage-metadata-extractor%2Fpackage.json)

This service gets an image file as input and provides image metadata as output.
The produced JSON result is written to the output file.

## Accepted mime types

+ `image/jpeg`

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | a path to the resulting output file |

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

# manually set ENV variables
INPUT_FILE=test.jpg OUTPUT_FILE=test_output.json node app.js
```

## Example Output

```json
{
    "exif": {
        "image": {
            "make": "NIKON CORPORATION",
            "model": "NIKON D70",
            "orientation": 1,
            "xResolution": 240,
            "yResolution": 240,
            "resolutionUnit": 2,
            "software": "GIMP 2.4.5",
            "imageWidth": 100,
            "imageLength": 66
        },
        "photo": {
            "fNumber": 9,
            "iso": 200,
            "shutterSpeedValue": 7.643856
        }
    },
    "byteSize": 14034
}
```

## License

Copyright © Fraunhofer ISST 2022
