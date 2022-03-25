# Similarity Network Bot 🤖

[![version](https://img.shields.io/badge/similarity--network--bot-0.1.0-green)](https://gitlab.cc-asp.fraunhofer.de/diva/faas/text-keyword-extractor)

A service to manage similarity edges between entity nodes in DIVA.

## Configuration

Environment variables:

Name | Default | Description
--- | --- | ---
INPUT_FILE    |  |  A path to the input file to be analyzed
OUTPUT_FILE  | |  A path to the resulting output file
LANG | en | Alpha2 code of language (`en` or `de`)|
NUMBER_KEYWORDS | 20 | Number of keywords to be extracted |

> **Warning**: Currently the language of a text is extracted automatically. Setting `LANG` has no effect. This could change in future versions!

## Install Multi-Rake (Ubuntu 18.04LTS & 20.04LTS)

There are some problems when installing this library. It is because of GCC6 that does not allow some things that GCC5 did.

Do following:

* use Python 3.6 or above
* use _pip3_
* use _sudo_ as there are permission problems
* run _pip3 install_ as following `sudo CFLAGS="-Wno-narrowing" pip install cld2-cffi`
* run `sudo pip3 install multi-rake`

## Developer

|**Daniel Tebernum**|
|:---:|
|[![Daniel Tebernum](https://avatars.githubusercontent.com/u/12967305?v=4)](https://github.com/DaTebe)|

## License

Copyright © Fraunhofer ISST 2022
