import re
import cv2
import numpy as np
import faiss
import joblib

from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer


# -------------------------
# FILE PATHS
# -------------------------

PDF_PATH = "2022_public.pdf"
POPPLER_PATH = r"C:\EquiGrade\poppler-25.12.0\Library\bin"


# -------------------------
# LOAD MODELS
# -------------------------

print("Loading models...")

embed_model = SentenceTransformer("all-MiniLM-L6-v2")

kmeans = joblib.load("physics_cluster_model.pkl")
score_model = joblib.load("physics_score_model.pkl")

index = faiss.read_index("physics_vector_index.faiss")


# -------------------------
# OCR MODEL
# -------------------------

ocr = PaddleOCR(
    use_textline_orientation=True,
    lang="en"
)


# -------------------------
# IMAGE PREPROCESSING
# -------------------------

def preprocess(img):

    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)

    return img


# -------------------------
# PDF → TEXT
# -------------------------

def extract_pdf_text(pdf_path):

    images = convert_from_path(
        pdf_path,
        poppler_path=POPPLER_PATH
    )

    text = ""

    for img in images:

        img = np.array(img)

        img = preprocess(img)

        result = ocr.ocr(img)

        if result is None:
            continue

        for line in result[0]:
            text += line[1][0] + "\n"

    return text


# -------------------------
# CLEAN TEXT
# -------------------------

def clean_text(text):

    lines = text.split("\n")

    cleaned = []

    for line in lines:

        line = line.strip()

        if len(line) < 4:
            continue

        l = line.lower()

        if "padasalai" in l:
            continue
        if "gmail" in l:
            continue
        if "www." in l:
            continue
        if "cbsetips" in l:
            continue

        cleaned.append(line)

    return "\n".join(cleaned)


# -------------------------
# QUESTION DETECTOR
# -------------------------

def split_questions(text):

    questions = []

    parts = re.split(r'\n\s*\d+\s*[\).]\s*', text)

    for p in parts:

        q = p.strip()

        if len(q) < 25:
            continue

        questions.append(q)

    return questions


# -------------------------
# REPEATED QUESTION CHECK
# -------------------------

def detect_repeated(vectors):

    repeated = 0

    for v in vectors:

        v = np.array([v], dtype="float32")

        D, I = index.search(v, 1)

        distance = D[0][0]

        if distance < 0.6:
            repeated += 1

    return repeated


# -------------------------
# MAIN PIPELINE
# -------------------------

print("Extracting text from PDF...")

raw_text = extract_pdf_text(PDF_PATH)

cleaned = clean_text(raw_text)

questions = split_questions(cleaned)

print("\nQuestions detected:", len(questions))

if len(questions) == 0:
    print("No questions detected from the PDF.")
    exit()


for i, q in enumerate(questions[:10]):
    print(f"\nQ{i+1}: {q[:120]}")


# -------------------------
# VECTORIZE QUESTIONS
# -------------------------

vectors = embed_model.encode(questions)
vectors = np.array(vectors).astype("float32")


# -------------------------
# DIFFICULTY CLUSTER
# -------------------------

clusters = kmeans.predict(vectors)

easy = sum(1 for c in clusters if c == 0)
medium = sum(1 for c in clusters if c == 1)
hard = sum(1 for c in clusters if c == 2)

difficulty = (easy*0.3 + medium*0.6 + hard*1.0) / len(clusters)


# -------------------------
# REPEATED QUESTIONS
# -------------------------

repeated = detect_repeated(vectors)

print("\nRepeated questions:", repeated)


# -------------------------
# EXTRA FEATURES
# -------------------------

avg_length = np.mean([len(q) for q in questions])

features = [[
    easy,
    medium,
    hard,
    repeated,
    avg_length,
    difficulty
]]


# -------------------------
# MARKS PREDICTION
# -------------------------

predicted = score_model.predict(features)[0]

print("\nPredicted Average Marks:", round(predicted,2))


# -------------------------
# STUDENT SIMULATION
# -------------------------

print("\nSimulating 10,000 students...")

scores = np.random.normal(predicted, 12, 10000)

scores = np.clip(scores,0,100)

top5 = np.percentile(scores,95)

print("Top 5% score:", round(top5,2))