import re
import numpy as np
import faiss
import joblib
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

# --- CONFIGURATION ---
PDF_PATH = "test_physics_paper.pdf" # Replace with your test PDF
POPPLER_PATH = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"

# Load Trained Models
print("Initializing AI Models...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
kmeans = joblib.load("cbse_physics_cluster_model.pkl")
score_model = joblib.load("cbse_physics_score_model.pkl")
index = faiss.read_index("cbse_physics_vector_index.faiss")

# Initialize PaddleOCR
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)

def analyze_paper():
    print(f"Analyzing CBSE Physics Paper: {PDF_PATH}")
    images = convert_from_path(PDF_PATH, poppler_path=POPPLER_PATH)
    
    raw_text = ""
    for img in images:
        result = ocr.ocr(np.array(img))
        if result and result[0]:
            for line in result[0]:
                raw_text += line[1][0] + "\n"
    
    # Split using CBSE numbering pattern
    questions = [p.strip() for p in re.split(r'(?:\n|^)\s*\d{1,2}\.\s+', raw_text) if len(p.strip()) > 25]
    
    if not questions:
        return print("No questions detected. Verify PDF quality.")

    # Vectorization and Clustering
    vectors = np.array(embed_model.encode(questions)).astype("float32")
    clusters = kmeans.predict(vectors)
    
    easy, med, hard = sum(clusters==0), sum(clusters==1), sum(clusters==2)
    diff_idx = (easy*0.3 + med*0.6 + hard*1.0) / len(questions)
    
    # Prediction
    features = [[easy, med, hard, 5, np.mean([len(q) for q in questions]), diff_idx]]
    pred_mean = score_model.predict(features)[0]
    
    # Statistical Normalization Simulation
    sim_scores = np.clip(np.random.normal(pred_mean, 8, 10000), 0, 70)
    
    print(f"\n--- CBSE Physics EquiGrade Report ---")
    print(f"Questions Analyzed: {len(questions)}")
    print(f"Predicted Board Mean: {round(pred_mean, 2)} / 70")
    print(f"Normalized Top 5% Cut-off: {round(np.percentile(sim_scores, 95), 2)}")

if __name__ == "__main__":
    analyze_paper()