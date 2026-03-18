import re
import cv2
import numpy as np
import faiss
import joblib
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

# -------------------------
# FILE PATHS & CONFIG
# -------------------------
PDF_PATH = "test_chemistry.pdf" # Replace with your target State Board PDF
POPPLER_PATH = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"

# -------------------------
# LOAD CHEMISTRY MODELS
# -------------------------
print("Loading State Board Chemistry AI Models...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Loading the specific State Board models
kmeans = joblib.load("chemistry_cluster_model.pkl")
score_model = joblib.load("chemistry_score_model.pkl")
index = faiss.read_index("chemistry_vector_index.faiss")

# Initialize PaddleOCR
ocr = PaddleOCR(use_textline_orientation=True, lang="en", show_log=False)

def preprocess(img):
    if len(img.shape) == 2:
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    return img

# -------------------------
# PDF → TEXT EXTRACTION
# -------------------------
def extract_pdf_text(pdf_path):
    images = convert_from_path(pdf_path, poppler_path=POPPLER_PATH)
    text = ""
    for img in images:
        img_np = np.array(img)
        img_np = preprocess(img_np)
        result = ocr.ocr(img_np)
        if result and result[0]:
            for line in result[0]:
                text += line[1][0] + "\n"
    return text

def clean_text(text):
    lines = text.split("\n")
    cleaned = []
    noise = ["padasalai", "gmail", "www.", "trbtnpsc", "register number"]
    for line in lines:
        line = line.strip()
        if len(line) < 5: continue
        if any(n in line.lower() for n in noise): continue
        # Filter Tamil-only lines while keeping English keywords/numbers
        if re.search(r'[\u0B80-\u0BFF]', line) and not re.search(r'[A-Za-z0-9]', line): continue
        cleaned.append(line)
    return "\n".join(cleaned)

def split_questions(text):
    # Matches State Board numbering (1., 2., 3., etc.)
    parts = re.split(r'(?:\n|^)\s*\d+[\s\).\-]+', text)
    return [p.strip() for p in parts if len(p.strip()) > 25]

def detect_repeated(vectors):
    repeated = 0
    for v in vectors:
        v = np.array([v], dtype="float32")
        D, I = index.search(v, 1) 
        if D[0][0] < 0.6: # Threshold for similarity
            repeated += 1
    return repeated

# -------------------------
# MAIN PIPELINE
# -------------------------
print(f"Analyzing Paper: {PDF_PATH}...")
raw_text = extract_pdf_text(PDF_PATH)
cleaned = clean_text(raw_text)
questions = split_questions(cleaned)

if not questions:
    print("Error: No questions detected. Check OCR or PDF quality.")
    exit()

print(f"Questions detected: {len(questions)}")

# Vectorization & Clustering
vectors = embed_model.encode(questions)
vectors = np.array(vectors).astype("float32")
clusters = kmeans.predict(vectors)

easy = sum(clusters == 0)
medium = sum(clusters == 1)
hard = sum(clusters == 2)

# Calculate Difficulty Index for State Board logic
difficulty_idx = (easy*0.3 + medium*0.6 + hard*1.0) / len(questions)
avg_length = np.mean([len(q) for q in questions])
repeated = detect_repeated(vectors)

# -------------------------
# PREDICTION & SIMULATION
# -------------------------
# Features: [easy, medium, hard, repeated, avg_length, difficulty]
features = [[easy, medium, hard, repeated, avg_length, difficulty_idx]]
predicted_mean = score_model.predict(features)[0]

print(f"\n--- EquiGrade Chemistry Report (State Board) ---")
print(f"Predicted Board Mean: {round(predicted_mean, 2)} / 70")

# Simulate 10,000 students for Percentile Equating
scores = np.random.normal(predicted_mean, 12, 10000)
scores = np.clip(scores, 0, 70)
top_5_cutoff = np.percentile(scores, 95)

print(f"Top 5% Normalization Cut-off: {round(top_5_cutoff, 2)}")