import os
import spacy
from langdetect import detect
import re
from progress.bar import Bar
import concurrent.futures
import math
import json

INPUT_FILE = os.getenv("INPUT_FILE")
OUTPUT_FILE = os.getenv("OUTPUT_FILE")
SPACY_MODEL_SIZE = os.getenv("SPACY_MODEL_SIZE", "md")
TEXT_LANG = os.getenv("TEXT_LANG")
OPEN_CLASS_POS_TAGS = ["NOUN", "PROPN", "ADJ", "ADV", "INTJ", "VERB", "PRON"]

models_map = {
    "en": f'en_core_web_{SPACY_MODEL_SIZE}',
    "de": f'de_core_news_{SPACY_MODEL_SIZE}'
}

nlp = ""


def extract_named_entities(text: str) -> dict:
    doc = nlp(text)
    named_entities = [t for t in doc if t.like_email or (t.ent_type and t.ent_iob_ == "B")]
    return {
        # count only meaningful tokens
        "length": len(set([t.lemma_.lower() for t in doc if t.pos_ in OPEN_CLASS_POS_TAGS])),
        "persons": set([t.lemma_.lower() for t in named_entities if t.ent_type_ in ["PERSON", "PER"]]),
        "organizations": set([t.lemma_.lower() for t in named_entities if t.ent_type_ == "ORG"]),
        "locations": set([t.lemma_.lower() for t in named_entities if t.ent_type_ in ["LOC", "GPE"]]),
        "emails": set([t.lemma_.lower() for t in named_entities if t.like_email]),
    }


def extract_phone_numbers(text: str) -> dict:
    return {
        "phone_numbers": set(re.findall(r'\+[-()\s\d]+?(?=\s*[+<])', text))
    }


def extract_entities(text: str) -> dict:
    return {**extract_named_entities(text), **extract_phone_numbers(text)}


def calculate_privacy(stats: dict, text_length: int) -> int:
    threshold = 20
    entities_sum = sum(stats.values())
    entities_proportion = entities_sum / text_length
    weight = max([entities_proportion, 0.6])
    weighted_entities_sum = sum([val * weight for val in stats.values()])
    return 100 if weighted_entities_sum >= threshold else int((weighted_entities_sum * 100 / threshold))


def count_entities(entities: dict) -> dict:
    return {k: len(set(v)) for k, v in entities.items()}


with open(INPUT_FILE, 'r') as f:
    file_size = os.path.getsize(INPUT_FILE)
    chunk_size = 1 * (10 ** 6)  # 1MB chunks, affects RAM consumption
    chunks = int(math.ceil(file_size / chunk_size)) if file_size > chunk_size else 1
    bar = Bar('Processing chunk', max=chunks)
    entities = {
        "numberOfFoundEmails": [],
        "numberOfFoundPhoneNumbers": [],
        "numberOfFoundOrganizations": [],
        "numberOfFoundPersons": [],
        "numberOfFoundLocations": [],
    }
    text_length = 0
    for chunk in iter(lambda: f.read(chunk_size), b''):
        if not chunk:
            break

        if not nlp:
            # load model depending on language
            try:
                lang = TEXT_LANG or detect(chunk)
                if lang not in models_map:
                    print(f'⚡ Language {lang} not supported! Fall back to "en"')
                    lang = "en"
            except:
                print("⛔ Failed to detect language! Fall back to 'en'")
                lang = "en"

            print("🇩🇪 Loading language model for", lang)
            nlp = spacy.load(models_map[lang])

        sub_chunk_size = int(math.ceil(chunk_size / 100))  # 10KB sub_chunks on all available processor cores
        sub_chunks = [chunk[i:i + sub_chunk_size] for i in range(0, len(chunk), sub_chunk_size)]

        with concurrent.futures.ProcessPoolExecutor() as executor:
            for extracted_entities in executor.map(extract_entities, sub_chunks):
                text_length += extracted_entities["length"]
                entities["numberOfFoundPersons"].extend(extracted_entities["persons"])
                entities["numberOfFoundOrganizations"].extend(extracted_entities["organizations"])
                entities["numberOfFoundLocations"].extend(extracted_entities["locations"])
                entities["numberOfFoundEmails"].extend(extracted_entities["emails"])
                entities["numberOfFoundPhoneNumbers"].extend(extracted_entities["phone_numbers"])
        bar.next()
    bar.finish()

    entities_counts = count_entities(entities)
    privacy_score = calculate_privacy(entities_counts, text_length)

    with open(OUTPUT_FILE, 'w') as of:
        json.dump({
            "personalData": {
                **entities_counts,
                "evaluatedPrivacyMetric": privacy_score

            }
        }, of)

    print("🚀 success", entities_counts, "Privacy:", privacy_score, "Text length", text_length)
