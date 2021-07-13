# Table Data Column Statistican 📊

[![version](https://img.shields.io/badge/table--data--column--statistican-v3.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-column-statistican)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-column-statistican/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/table-data-column-statistican/-/commits/master)

This service gets a table data file in `text/csv` as input and provides the calculated statistics for each columns as output. The produced JSON result is written to the output file.

## Accepted MIME Types

+ `text/csv`

## Configuration

Environment variables:

| Name | Default | Description |
| --- | --- | --- |
| INPUT_FILE | | a path to the input file to be analyzed |
| OUTPUT_FILE | | a path to the resulting output file |

## Run

```sh
# if environment ist defined in IDE
npm run start

# manually set ENV variables
INPUT_FILE=table.csv OUTPUT_FILE=result.json node app.js
```

## Example Output

```json
{
    "tableCompleteness": 1,
    "maxNumberOfRows": 56,
    "numberOfColumns": 8,
    "columnStatistics": [
        {
            "title": "incidents_85_99",
            "columnIndex": 2,
            "numberOfNumbers": 56,
            "numberOfStrings": 0,
            "numberOfNullElements": 0,
            "numberOfRows": 56,
            "dataType": "number",
            "frequencyNumbers": [
                {
                    "token": 2,
                    "count": 9
                },
                {
                    "token": 76,
                    "count": 1
                },
                {
                    "token": 6,
                    "count": 2
                },
                {
                    "token": 3,
                    "count": 8
                },
                ...
            ],
            "sum": 402,
            "sumSquared": 9584,
            "sumSquaredError": 6698.214285714285,
            "minValue": 0,
            "maxValue": 76,
            "mean": 7.178571428571429,
            "meanSquaredError": 119.61096938775509,
            "median": 4,
            "variancePopulation": 119.61096938775509,
            "varianceSample": 121.78571428571428,
            "standardDeviationPopulation": 10.936679998416114,
            "standardDeviationSample": 11.035656495456637,
            "meanDeviation": 5.8265306122448965,
            "medianDeviation": 3,
            "skewness": 4.60347699461335,
            "excessKurtosis": 25.34207064008027,
            "coefficientVariation": 1.5235176117196576,
            "quantileQ1": 2,
            "quantileQ2": 4,
            "quantileQ3": 8,
            "completeness": 1,
            "maxNumberOfRows": 56,
            "id": "col#2#incidents_85_99"
        }
    ]
}
```

## Developer

|**Daniel Tebernum**|**Dustin Chabrowski**|
|:---:|:---:|
| [![Daniel Tebernum](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3566/avatar.png?width=200)](https://gitlab.cc-asp.fraunhofer.de/dtebernum) | [![Duske](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3563/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dchabrowski) |

## License

Copyright © Fraunhofer ISST 2021