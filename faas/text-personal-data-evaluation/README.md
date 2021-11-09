# Text Personal Data Evaluation 🕵️

[![version](https://img.shields.io/badge/text--personal--data--evaluation-v3.0.0-green)](https://github.com/FraunhoferISST/diva/tree/main/faas/text-personal-data-evaluation)

This service gets a plain text file as input, extracts emails, organizations, locations, phone numbers and personalities to estimate the level of privacy,
using [spaCy](https://spacy.io/).
The privacy is estimated with the formula:

```
threshold = 20 # we assume that document with >= 20 entites have the privacy=100 (maximum)
entities_proportion = absolute_unique_entities_count / meaningful_text_tokens_count
weight = max([entities_proportion, 0.6]) # some weight to smooth false positives
weighted_entities_sum = sum(for each entity_type_count -> entity_count * weight)
privacy_score 100 if weighted_entities_sum > threshold else int((weighted_entities_sum * 100 / threshold))
```

The JSON result is written to the output file and looks like follows.

```json
// meaningful_text_tokens_count length: 401
{
  "personalData": {
    "numberOfFoundEmails": 0,
    "numberOfFoundPhoneNumbers": 0,
    "numberOfFoundOrganizations": 10,
    "numberOfFoundPersons": 4,
    "numberOfFoundLocations": 3,
    "evaluatedPrivacyMetric": 50
  }
}
```


## Accepted MIME Types

+ `text/plain`

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file
TEXT_LANGUAGE (optional)  |`en` |  A language of the text. Will be extracted automatically, if not passed. Falls back to english, if recognition fails.

## Development

The service allocates around 600 MB RAM for large files and can process over 6 MB of text each ~50 seconds on powerful machine 
(higher number of cores => much faster processing). The RAM consumption can be tweaked by file chunk size read on each
iteration. Smaller chunks reduce the allocated RAM, but add read overhead and increment execution time.
The current optimal formula on i7-7800 (6/12) is:

```
for 1_MB_chunks in file
  for 10_KB_sub_chunks in 1_MB_chunks
     process(each sub_chunk)
```



**Requirements:**
+ python 3.8+
+ 700+ MB RAM on runtime

Install dependencies:

```
pip3 install -r requirements.txt
```

Run the script with specified ENV's. You can create in the root `test.txt` and `output.json` files:

```
python3 profiling.py
```

## Developers

|**Sergej Atamantschuk**|
|:---:|
| [![Sergej Atamantschuk](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3617/avatar.png?width=400)](https://github.com/Igelex) | 

**Version <3.0.0:**

|**Julia Pampus**|**Daniel Tebernum**|**Dustin Chabrowski**|
|:---:| :---:|:---:|
| [![Julia Pampus](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/4688/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/jpampus) | [![Daniel Tebernum](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3566/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dtebernum)    | [![Duske](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3563/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/dchabrowski)  |

## License

Copyright © Fraunhofer ISST 2021
