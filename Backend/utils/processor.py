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
    try:
        images = convert_from_bytes(file_bytes, dpi=200)
    except Exception as e:
        print(f"Error converting PDF bytes: {e}")
        images = []

    text = ""
    for img in images:
        res = ocr.ocr(np.array(img))
        if res and res[0]:
            for line in res[0]:
                text += line[1][0] + "\n"

    # 2. Split Questions
    pattern = r"\n\s*\d{1,2}\.\s+" if board == "CBSE" else r'\n\s*\d+[\s\).\-]+'
    questions = [q.strip() for q in re.split(pattern, text) if len(q.strip()) > 25]

    if not questions:
        # Fallback default feature estimation if PDF text is scanned / image-only without OCR text lines
        easy, med, hard = (6, 12, 7) if board == "CBSE" else (10, 11, 4)
        avg_len = 120.0
        diff_idx = (easy * 0.3 + med * 0.6 + hard * 1.0) / (easy + med + hard)
        return [easy, med, hard, 5, avg_len, diff_idx]

    # 3. Clustering: Easy/Medium/Hard
    folder_prefix = "CBSC" if board == "CBSE" else "SB"
    file_prefix = "cbse_" if board == "CBSE" else ""
    cluster_model_path = os.path.join(
        BASE_DIR, 
        f"{folder_prefix} {subject.capitalize()} Model", 
        f"{file_prefix}{subject}_cluster_model.pkl"
    )
    kmeans = joblib.load(cluster_model_path)

    vectors = np.array(embed_model.encode(questions)).astype("float32")
    clusters = kmeans.predict(vectors)

    # Count difficulty distribution
    counts = np.bincount(clusters, minlength=3)
    easy, med, hard = int(counts[0]), int(counts[1]), int(counts[2])

    # Calculate paper complexity
    diff_idx = (easy * 0.3 + med * 0.6 + hard * 1.0) / len(questions)

    # Return features for the Score Model
    return [easy, med, hard, 5, float(np.mean([len(q) for q in questions])), float(diff_idx)]