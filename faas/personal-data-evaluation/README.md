# Personal Data Evaluation 🕵️

[![version](https://img.shields.io/badge/personal--data--evaluation-v2.0.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/drm)
[![pipeline status](https://gitlab.cc-asp.fraunhofer.de/diva/faas/personal-data-evaluation/badges/master/pipeline.svg)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/personal-data-evaluation/-/commits/master)

This service gets a plain text file as input, extracts emails, numbers and named entities to estimate the level of privacy, using [Stanford NLP](https://nlp.stanford.edu/)
, [nlp.js](https://github.com/axa-group/nlp.js?utm_source=recordnotfound.com) and [natural](https://github.com/NaturalNode/natural). The JSON result is 
written to the output file.


## Accepted MIME Types

+ `text/plain`

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file

## Example Output

```json
{
    "personalData":{
        "numberOfFoundEmails":0,
        "numberOfFoundPhoneNumbers":0,
        "numberOfFoundOrganizations":4,
        "numberOfFoundPersons":1,
        "numberOfFoundLocations":0,
        "evaluatedPrivacyMetric":0
    }
}
```

## Known issues

Service needs linear time to work. A chunck of 50 sentences is processed in 3s to 60s depending on the content and computational power.

## Developers

|**Julia Pampus**|**Daniel Tebernum**|**Dustin Chabrowski**|
|:---:| :---:|:---:|
| [![Julia Pampus](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/4688/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/jpampus) | [![Daniel Tebernum](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3566/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dtebernum)    | [![Duske](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3563/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dchabrowski)  |

## License

Copyright © Fraunhofer ISST 2021
