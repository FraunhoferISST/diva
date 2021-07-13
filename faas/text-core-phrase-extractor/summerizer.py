from __future__ import absolute_import
from __future__ import division, print_function, unicode_literals

from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer

from sumy.summarizers.lsa import LsaSummarizer as LsaSummarizer                    # http://www.kiv.zcu.cz/~jstein/publikace/isim2004.pdf
from sumy.summarizers.luhn import LuhnSummarizer as LuhnSummarizer                 # https://ieeexplore.ieee.org/document/5392672?arnumber=5392672
from sumy.summarizers.lex_rank import LexRankSummarizer as LexRankSummarizer       # http://tangra.cs.yale.edu/~radev/si/lexrank/lexrank.pdf
from sumy.summarizers.text_rank import TextRankSummarizer as TextRankSummarizer    #
from sumy.summarizers.sum_basic import SumBasicSummarizer as SumBasicSummarizer    # http://www.cis.upenn.edu/~nenkova/papers/ipm.pdf
from sumy.summarizers.kl import KLSummarizer as KLSummarizer                       # http://www.aclweb.org/anthology/N09-1041
from sumy.summarizers.reduction import ReductionSummarizer as ReductionSummarizer

from sumy.nlp.stemmers import Stemmer
from sumy.utils import get_stop_words

from guess_language import guess_language

import os
import json

supportedLanguages = [
    ('en', 'english'),
    ('de', 'german'),
    ('cs', 'czech'),
    ('fr', 'french'),
    ('sk', 'slovak'),
    ('ja', 'japanese'),
    ('pt', 'portuguese'),
    ('es', 'spanish'),
]

print("👀 Read environment variables")

INPUT_FILE = os.environ['INPUT_FILE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']
LANGUAGE = [language for language in supportedLanguages if language[0] == os.getenv('LANG', 'en')][0][1]
NUMBER_SENTENCES = int(os.getenv('NUMBER_SENTENCES', '10'))
ALGORITHMS = json.loads(os.getenv('ALGORITHMS', '["LSA","LUHN"]'))

print("👀 Reading text...")
file_object = open(INPUT_FILE, 'r')
text = file_object.read()
file_object.close()

print("👀 Detect language...")
LANGUAGE = guess_language(text)
del text

print("🗝  Extracting " + str(NUMBER_SENTENCES) + " sentences using " + str(ALGORITHMS) + " in " + LANGUAGE)

def core_phrases_lsa(parser, stemmer):
    lsa_result = []
    try:
        lsa_summarizer = LsaSummarizer(stemmer)
        lsa_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in lsa_summarizer(parser.document, NUMBER_SENTENCES):
            lsa_result.append(str(sentence))
    except:
        lsa_result = []
    return lsa_result

def core_phrases_luhn(parser, stemmer):
    luhn_result = []
    try:
        luhn_summarizer = LuhnSummarizer(stemmer)
        luhn_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in luhn_summarizer(parser.document, NUMBER_SENTENCES):
            luhn_result.append(str(sentence))
    except:
        luhn_result = []
    return luhn_result    

def core_phrases_lexrank(parser, stemmer):
    lex_result = []
    try:
        lex_summarizer = LexRankSummarizer(stemmer)
        lex_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in lex_summarizer(parser.document, NUMBER_SENTENCES):
            lex_result.append(str(sentence))
    except:
        lex_result = []    
    return lex_result       

def core_phrases_textrank(parser, stemmer):
    text_result = []
    try:
        text_summarizer = TextRankSummarizer(stemmer)
        text_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in text_summarizer(parser.document, NUMBER_SENTENCES):
            text_result.append(str(sentence))   
    except:
        text_result = []
    return text_result    

def core_phrases_sumbasic(parser, stemmer):
    sum_result = []
    try:
        sum_summarizer = SumBasicSummarizer(stemmer)
        sum_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in sum_summarizer(parser.document, NUMBER_SENTENCES):
            sum_result.append(str(sentence))
    except:
        sum_result = []
    return sum_result    

def core_phrases_kl(parser, stemmer):
    kl_result = []
    try:
        kl_summarizer = KLSummarizer(stemmer)
        kl_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in kl_summarizer(parser.document, NUMBER_SENTENCES):
            kl_result.append(str(sentence))   
    except:
        kl_result = []
    return kl_result    

def core_phrases_reduction(parser, stemmer):
    reduction_result = []
    try:
        reduction_summarizer = ReductionSummarizer(stemmer)
        reduction_summarizer.stop_words = get_stop_words(LANGUAGE)
        for sentence in reduction_summarizer(parser.document, NUMBER_SENTENCES):
            reduction_result.append(str(sentence))   
    except:
        reduction_result = []
    return reduction_result 

if __name__ == "__main__":

    summarizeResultList = []
    luhn_result = []

    try:
        parser = PlaintextParser.from_file(INPUT_FILE, Tokenizer(LANGUAGE))
        stemmer = Stemmer(LANGUAGE)

        if 'LSA' in ALGORITHMS:
            summarizeResultList.append({'algorithm': 'LSA', 'sentences': core_phrases_lsa(parser, stemmer)})

        if 'LUHN' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'Luhn', 'sentences': core_phrases_luhn(parser, stemmer)})

        if 'LEXRANK' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'LexRank', 'sentences': core_phrases_lexrank(parser, stemmer)})

        if 'TEXTRANK' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'TextRank', 'sentences': core_phrases_textrank(parser, stemmer)})

        if 'SUMBASIC' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'SumBasic', 'sentences': core_phrases_sumbasic(parser, stemmer)})

        if 'KL' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'KL', 'sentences': core_phrases_kl(parser, stemmer)})

        if 'REDUCTION' in ALGORITHMS:    
            summarizeResultList.append({'algorithm': 'Reduction', 'sentences': core_phrases_reduction(parser, stemmer)})

    except Exception as e:
        print("⛔ Error while extracting core phrases: " + e)


    result_str = json.dumps({'corePhrases': summarizeResultList})

    # output result
    print("🖊  Write result...")
    f = open(OUTPUT_FILE, "w")
    f.write(str(result_str))
    f.close()

    print("🚀 success")