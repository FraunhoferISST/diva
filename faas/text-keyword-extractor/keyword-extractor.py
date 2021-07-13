import os
import json
from guess_language import guess_language
from multi_rake import Rake

INPUT_FILE = os.environ['INPUT_FILE']
OUTPUT_FILE = os.environ['OUTPUT_FILE']
LANGUAGE = os.getenv('LANG', 'en')
NUMBER_KEYWORDS = os.getenv('NUMBER_KEYWORDS', '20')
print("🏳️  Language:")
print("🏳️", LANGUAGE)

result = []

# load text into memory
print("👀 Reading text...")
file_object = open(INPUT_FILE, 'r')
text = file_object.read()
file_object.close()

print("👀 Detect language...")
LANGUAGE = guess_language(text)


# initialize RAKE (Multi-RAKE)
print("🏗  Build keyword base...")
rake = Rake(
    min_chars=3,
    max_words=1,
    min_freq=1,
    language_code=LANGUAGE,
    stopwords=None,  # {'and', 'of'}
    lang_detect_threshold=50,
    max_words_unknown_lang=2,
    generated_stopwords_percentile=80,
    generated_stopwords_max_len=3,
    generated_stopwords_min_freq=2,
)

keywords_scores_rake = rake.apply(text)                 # Apply Multi-Rake to text
keywords_rake = [x[0] for x in keywords_scores_rake]    # create variable with removed scores for further processing

print("🔑 Select best keywords...")
if LANGUAGE == 'de':
    from KeywordReasoner.KeywordReasonerGerman import KeywordReasonerGerman
    result = KeywordReasonerGerman(keywords_rake, text, int(NUMBER_KEYWORDS))

elif LANGUAGE == 'en':
    from KeywordReasoner.KeywordReasonerEnglish import KeywordReasonerEnglish
    result = KeywordReasonerEnglish(keywords_rake, text, int(NUMBER_KEYWORDS))
else:
    print("🚩 Language not Supported")

result_str = json.dumps({"keywords": result })
print("📄 Result: " + result_str)

# output result
f = open(OUTPUT_FILE, "w")
f.write(str(result_str))
f.close()
