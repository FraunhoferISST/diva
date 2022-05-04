# Image Text Extractor 📤

![GitHub](https://img.shields.io/badge/version-v3.0.0-green)

This service gets an image file as input and provides OCR recognized image text as output.
The produced JSON result is written to the output file.

## Accepted MIME Types

+ `image/jpeg`

## Requirements

+ **Python** >=3.8.x
+ **tesseract-ocr** (install via apt or apk)

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed (`image/jpeg`) |
| OUTPUT_FILE | | a path to the resulting output file (`application/json`) |

## Setting up for Development

### Local

Install dependencies:

```bash
pip3 install -r ./requirements.txt
apk --no-cache add    tesseract-ocr \
                          jpeg-dev \
                          zlib-dev \
                          freetype-dev \
                          lcms2-dev \
                          openjpeg-dev \
                          tiff-dev \
                          tk-dev \
                          tcl-dev \
                          harfbuzz-dev \
                          fribidi-dev
```

or

```bash
apt install tesseract-ocr
```

## License

Copyright © Fraunhofer ISST 2022
