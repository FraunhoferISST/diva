import sys
import json
import string
from collections import Counter
from nltk.tokenize import TweetTokenizer, sent_tokenize

# load text into memory
file_object = open(sys.argv[1], 'r')
text = file_object.read()

# count sentences and words
wordCount = 0
tokenizer_words = TweetTokenizer()
tokens_sentences = [tokenizer_words.tokenize(t) for t in sent_tokenize(text)]
for s in tokens_sentences:
    wordCount += len(s)


# count characters and character distribution
text = filter(lambda x: x in string.ascii_letters, text.lower())
c = Counter(text)
i = list(c.items())
charcterCount = 0
for c in i:
    charcterCount += c[1]

result = {
    'numberOfSentences': len(tokens_sentences),
    'numberOfWords': wordCount,
    'numberOfCharacters': charcterCount,
    'characterDistribution': i
}

json_string = json.dumps(result)
print(json_string)
