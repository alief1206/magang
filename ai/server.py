# pyrefly: ignore [missing-import]
from flask import Flask, request, jsonify
import joblib
import pandas as pd
import re
# pyrefly: ignore [missing-import]
import nltk
# pyrefly: ignore [missing-import]
from nltk.corpus import stopwords
# pyrefly: ignore [missing-import]
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import warnings

warnings.filterwarnings('ignore')

app = Flask(__name__)

# Load models and vectorizer
try:
    model_kategori = joblib.load('model_kategori.pkl')
    model_prioritas = joblib.load('model_prioritas.pkl')
    tfidf_vectorizer = joblib.load('tfidf_vectorizer')
except Exception as e:
    print(f"Error loading models: {e}")

# Download stopwords if not present
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

stop_words = stopwords.words('indonesian')
stop_words.extend(["nya", "nih", "dong", "tolong", "pak", "bu"])

factory = StemmerFactory()
stemmer = factory.create_stemmer()

normalisasi = {
    "gk":"tidak", "ga":"tidak", "nggak":"tidak", "tdk":"tidak",
    "yg":"yang", "dr":"dari", "dgn":"dengan", "udh":"sudah",
    "blm":"belum", "krn":"karena", "bgt":"banget", "tp":"tetapi",
    "aja":"saja", "org":"orang", "sy":"saya", "utk":"untuk"
}

def case_folding(text):
    return text.lower()

def cleaning(text):
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"www\S+", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"_", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def normalisasi_kata(text):
    kata = text.split()
    hasil = [normalisasi[word] if word in normalisasi else word for word in kata]
    return " ".join(hasil)

def tokenizing(text):
    return text.split()

def stopword_removal(tokens):
    return [word for word in tokens if word not in stop_words]

def stemming(tokens):
    return [stemmer.stem(word) for word in tokens]

def join_text(tokens):
    return " ".join(tokens)

def preprocess_text(text):
    text = case_folding(text)
    text = cleaning(text)
    text = normalisasi_kata(text)
    tokens = tokenizing(text)
    tokens = stopword_removal(tokens)
    tokens = stemming(tokens)
    return join_text(tokens)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({'error': 'No text provided'}), 400
    
    text = data['text']
    clean_text = preprocess_text(text)
    
    # Vectorize text
    text_vector = tfidf_vectorizer.transform([clean_text])
    
    # Predict category and priority
    kategori = model_kategori.predict(text_vector)[0]
    prioritas = model_prioritas.predict(text_vector)[0]
    
    return jsonify({
        'category': str(kategori),
        'priority': str(prioritas)
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)
