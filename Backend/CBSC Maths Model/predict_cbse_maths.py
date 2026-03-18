import re
import cv2
import numpy as np
import faiss
import joblib
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

PDF_PATH = "65-1-2 Mathematics.pdf"
POPPLER_PATH = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"

# Load CBSE Specific Models
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
kmeans = joblib.load("cbse_maths_cluster_model.pkl")
score_model = joblib.load("cbse_maths_score_model.pkl")
index = faiss.read_index("cbse_maths_vector_index.faiss")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)

def extract_text(path):
    images = convert_from_path(path, poppler_path=POPPLER_PATH)
    text = ""
    for img in images:
        result = ocr.ocr(np.array(img))
        if result and result[0]:
            for line in result[0]: text += line[1][0] + "\n"
    return text

print("Analyzing CBSE Maths Paper...")
raw = extract_text(PDF_PATH)
# Pattern for CBSE 1-14 numbering [cite: 593]
questions = [p.strip() for p in re.split(r'(?:\n|^)\s*\d{1,2}\.\s+', raw) if len(p.strip()) > 25]

vectors = np.array(embed_model.encode(questions)).astype("float32")
clusters = kmeans.predict(vectors)
easy, med, hard = sum(clusters==0), sum(clusters==1), sum(clusters==2)
diff_idx = (easy*0.2 + med*0.5 + hard*1.0) / len(questions)

features = [[easy, med, hard, 2, np.mean([len(q) for q in questions]), diff_idx]]
pred_mean = score_model.predict(features)[0]

# Percentile Normalization (Out of 40) 
sim_scores = np.clip(np.random.normal(pred_mean, 5, 10000), 0, 40)
print(f"\n--- CBSE Maths EquiGrade Report ---")
print(f"Predicted Board Mean (out of 40): {round(pred_mean, 2)}")
print(f"Normalized Top 5% Score: {round(np.percentile(sim_scores, 95), 2)}")