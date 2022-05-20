# Table Data to CSV Converter 🔄

![GitHub](https://img.shields.io/badge/version-v1.0.0-green)

The service converts a given table data file to a `.csv` file.

## Accepted MIME Types

+ `text/csv`
+ `application/x-sas-data`

### Configuration

Environment variables:

You can use `setenv` to set the variables in your dev environment.

| Name | Default | Description |
| --- | --- | --- |
| MIME_TYPE | | the mime-type of the file |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | a path to the resulting output `csv` file |

## Local Development

### Requirements

+ Python 3

### Dependencies

```sh
pip3 install -r requirements.txt
```

### Run

```sh
# do not forget to set envirnment variables first!!!
python3 convert.py
```

## License

Copyright © Fraunhofer ISST 2021
