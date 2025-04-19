
"""Provides fuzzy correction against a supermarket lexicon."""
import json, pathlib, textdistance

LEX_PATH = pathlib.Path(__file__).resolve().parent.parent / 'data' / 'supermercado_lex.json'
try:
    LEXICON = set(json.loads(LEX_PATH.read_text()))
except FileNotFoundError:
    LEXICON = set()

def fuzzy_correct(word: str) -> str:
    if word in LEXICON or not word.isalpha():
        return word
    best, score = None, 1.0
    for w in LEXICON:
        s = textdistance.levenshtein.normalized_distance(word.lower(), w.lower())
        if s < score:
            best, score = w, s
    return best if score <= 0.25 else word
