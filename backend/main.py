from fastapi import FastAPI
from pydantic import BaseModel
import tensorflow as tf
from preprocess import tokenize_pad
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sesuaikan origin Next.js
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load model
model = tf.keras.models.load_model('spam_cnn_model.h5')

class SMS(BaseModel):
    message: str

@app.post('/predict')
def predict(sms: SMS):
    x = tokenize_pad(sms.message)
    prob = model.predict(x)[0][0]
    label = 'Spam' if prob > 0.5 else 'Not Spam'
    return { 'label': label, 'probability': float(prob) }
