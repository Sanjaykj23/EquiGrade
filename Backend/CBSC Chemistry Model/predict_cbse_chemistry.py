import re, numpy as np, faiss, joblib
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

PDF_PATH = "cbse_2024_chemistry.pdf" # Place your PDF here
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
kmeans = joblib.load("cbse_chemistry_cluster_model.pkl")
score_model = joblib.load("cbse_chemistry_score_model.pkl")
index = faiss.read_index("cbse_chemistry_vector_index.faiss")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)

def analyze():
    print(f"Analyzing Paper: {PDF_PATH}...")
    images = convert_from_path(PDF_PATH, poppler_path=r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin")
    raw = ""
    for img in images:
        res = ocr.ocr(np.array(img))
        if res and res[0]:
            for line in res[0]: raw += line[1][0] + "\n"
    
    questions = [p.strip() for p in re.split(r'(?:\n|^)\s*\d{1,2}\.\s+', raw) if len(p.strip()) > 25]
    if not questions: return print("No questions detected.")

    vectors = np.array(embed_model.encode(questions)).astype("float32")
    clusters = kmeans.predict(vectors)
    diff_idx = (sum(clusters==0)*0.3 + sum(clusters==1)*0.6 + sum(clusters==2)*1.0) / len(questions)
    
    features = [[sum(clusters==0), sum(clusters==1), sum(clusters==2), 4, np.mean([len(q) for q in questions]), diff_idx]]
    pred_mean = score_model.predict(features)[0]
    sim_scores = np.clip(np.random.normal(pred_mean, 8, 10000), 0, 70)
    
    print(f"\n--- CBSE Chemistry Report ---")
    print(f"Total Questions: {len(questions)}")
    print(f"Predicted Board Mean: {round(pred_mean, 2)} / 70")
    print(f"95th Percentile Cut-off: {round(np.percentile(sim_scores, 95), 2)}")

analyze()