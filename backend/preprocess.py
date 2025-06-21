import re
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences


MAX_LEN = 10000
NUM_WORDS = 5000
tokenizer = Tokenizer(num_words=NUM_WORDS)
def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", '', text)
    return text


def tokenize_pad(text: str):
    seq = tokenizer.texts_to_sequences([clean_text(text)])
    padded = pad_sequences(seq, maxlen=MAX_LEN)
    return padded