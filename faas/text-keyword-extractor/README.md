# Text Keyword Extractor 🔑

![GitHub](https://img.shields.io/badge/version-v4.1.0-green)

A simple service to extract keywords from a text file.

## 🧠 Rake Algorithm

RAKE short for Rapid Automatic Keyword Extraction algorithm, is a domain independent keyword extraction algorithm which tries to determine key phrases in a body of text by analyzing the frequency of word appearance and its co-occurance with other words in the text.

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

## Install NLTK

We need to download some additional data for _nltk_.
Online guide: [here](https://www.nltk.org/data.html).
This needs to be considered when building a Docker Container for text profiling. 😅

## Train German Tagger

A lot of different corpi can be used to train the tagger.
For german we use the TIGER corpus.
We can read corpi if they are in the _conll09_ format.
Also other formats are supported.

```python
import nltk
corp = nltk.corpus.ConllCorpusReader('.', 'tiger_release_aug07.corrected.16012013.conll09',
                                     ['ignore', 'words', 'ignore', 'ignore', 'pos'],
                                     encoding='utf-8')
```

Then we are going to split the corpus in a train and a test set.
We are going to use 90% of the corpus for training an 10% for testing.

```python
import random

tagged_sents = list(corp.tagged_sents())
random.shuffle(tagged_sents)

split_perc = 0.1
split_size = int(len(tagged_sents) * split_perc)
train_sents, test_sents = tagged_sents[split_size:], tagged_sents[:split_size]
```

Now we can train our tagger by using a german classifier called _ClassifierBasedGermanTagger_.
It can be downloaded here: [ClassifierBasedGermanTagger](https://github.com/ptnplanet/NLTK-Contributions/tree/master/ClassifierBasedGermanTagger).

```python
from ClassifierBasedGermanTagger.ClassifierBasedGermanTagger import ClassifierBasedGermanTagger
tagger = ClassifierBasedGermanTagger(train=train_sents)

# identifiy accuracy
print(accuracy = tagger.evaluate(test_sents))
```

## License

Copyright © Fraunhofer ISST 2022
