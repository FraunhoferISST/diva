# Table Data Apriori Associations Extractor Microservice

This service gets a CSV table data file as input, extracts its content and provides the
associations by Apriori algorithm as output. The produced JSON result is written to the output file.

## 🧠 About Apriori
The apriori algorithm uncovers hidden structures in categorical data. The classical example is a database containing purchases from a supermarket. Every purchase has a number of items associated with it. We would like to uncover association rules such as {bread, eggs} -> {bacon} from the data. This is the goal of association rule learning, and the Apriori algorithm is arguably the most famous algorithm for this problem. This repository contains an efficient, well-tested implementation of the apriori algorithm as descriped in the original paper by Agrawal et al, published in 1994.

More information: https://github.com/tommyod/Efficient-Apriori

## Usage

### Accepted MIME Types

+ `text/csv`

### Configuration

Environment variables:
You can use `setenv` to set the variables in your dev environment. 

Name | Default | Description
--- | --- | ---
INPUT_FILE || A path to the input file to be analyzed (`text/csv`)
OUTPUT_FILE || A path to the resulting output file (`application/json`)
MIN_SUPPORT  | 0.8 |  Minimal support for Apriori algorithm
MIN_CONFIDENCE  | 0.9 |  Minimal confidence for Apriori algorithm

## Sample output

```
[
    {
      "lhs": { "bl_of_lymph_c": "no" },
      "rhs": { "bl_of_lymph_s": "no" },
      "support": 0.82432,
      "confidence": 1.0,
      "lift": 1.05
    },
    {
      "lhs": { "regeneration_of": "no" },
      "rhs": { "lym_nodes_dimin": "1", "bl_of_lymph_s": "no" },
      "support": 0.89865,
      "confidence": 0.96377,
      "lift": 1.041
    }
]
```

## Local Development

### Requirements

+ Python 3.6+

### Dependencies

```bash
pip3 install -r requirements.txt
```

### Run

```bash
// Do not forget to set envirnment variables first!!!
python3 apriori.py
```

## Developers

|**Marcel Altendeitering**|**Sergej Atamantschuk**|
|:---:| :---:|
| [![Marcel Altendeitering](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3589/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/maltendeitering) | [![Sergej Atamantschuk](https://gitlab.cc-asp.fraunhofer.de/uploads/-/system/user/avatar/3617/avatar.png?width=400)](https://gitlab.cc-asp.fraunhofer.de/satamantschuk)|

## License

Copyright © Fraunhofer ISST 2020
