import numpy as np
import joblib
import re
import os
from pdf2image import convert_from_bytes
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

# Initialize models once to save memory
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def analyze_document(file_bytes, board, subject):
    # 1. OCR: Convert PDF to Text
    images = convert_from_bytes(file_bytes, dpi=200)
    text = ""
    for img in images:
        res = ocr.ocr(np.array(img))
        if res and res[0]:
            for line in res[0]: text += line[1][0] + "\n"

    # 2. Split Questions
    pattern = r"\n\s*\d{1,2}\.\s+" if board == "CBSE" else r'\n\s*\d+[\s\).\-]+'
    questions = [q.strip() for q in re.split(pattern, text) if len(q.strip()) > 25]
    
    # 3. Clustering: Easy/Medium/Hard
    folder_prefix = "CBSC" if board == "CBSE" else "SB"
    cluster_model_path = os.path.join(BASE_DIR, f"{folder_prefix} {subject.capitalize()} Model", f"{subject}_cluster_model.pkl")
    kmeans = joblib.load(cluster_model_path)
    
    vectors = np.array(embed_model.encode(questions)).astype("float32")
    clusters = kmeans.predict(vectors)
    
    # Count difficulty distribution
    counts = np.bincount(clusters, minlength=3)
    easy, med, hard = counts[0], counts[1], counts[2]
    
    # Calculate paper complexity
    diff_idx = (easy*0.3 + med*0.6 + hard*1.0) / len(questions)
    
    # Return features for the Score Model
    return [easy, med, hard, 5, np.mean([len(q) for q in questions]), diff_idx]