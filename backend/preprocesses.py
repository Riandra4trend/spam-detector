import re
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load tokenizer
import pickle
with open('tokenizer.pkl', 'rb') as f:
    tokenizer = pickle.load(f)

MAX_LEN = 100


def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", '', text)
    return text


def tokenize_pad(text: str):
    seq = tokenizer.texts_to_sequences([clean_text(text)])
    padded = pad_sequences(seq, maxlen=MAX_LEN)
    return padded