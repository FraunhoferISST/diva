import nltk
import random
import pickle

from ClassifierBasedGermanTagger.ClassifierBasedGermanTagger import ClassifierBasedGermanTagger

print('Import Corpus...')
corp = nltk.corpus.ConllCorpusReader('.', 'tiger_release_aug07.corrected.16012013.conll09',
                                     ['ignore', 'words', 'ignore', 'ignore', 'pos'],
                                     encoding='utf-8')

print('Read tagged sentences...')
tagged_sents = list(corp.tagged_sents())

print('Shuffle sentences for learning...')
random.shuffle(tagged_sents)

print('Split dataset into training and test data...')
split_perc = 0.1
split_size = int(len(tagged_sents) * split_perc)
train_sents, test_sents = tagged_sents[split_size:], tagged_sents[:split_size]

print('Train model...')
tagger = ClassifierBasedGermanTagger(train=train_sents)

print('Calculate accuracy...')
accuracy = tagger.evaluate(test_sents)

print(accuracy)

#print(tagger.tag(['Das', 'ist', 'ein', 'einfacher', 'Test']))

print('Save model to disk...')
with open('nltk_german_classifier_data.pickle', 'wb') as f:
    pickle.dump(tagger, f, protocol=2)

print('Finished!')