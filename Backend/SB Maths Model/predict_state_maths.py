import re, numpy as np, faiss, joblib
from pdf2image import convert_from_path
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

PDF_PATH = "test_maths_paper.pdf"
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
kmeans, score_model = joblib.load("maths_cluster_model.pkl"), joblib.load("maths_score_model.pkl")
index = faiss.read_index("maths_vector_index.faiss")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)

def analyze():
    print(f"Analyzing Maths Paper: {PDF_PATH}")
    images = convert_from_path(PDF_PATH, poppler_path=r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin")
    raw = ""
    for img in images:
        res = ocr.ocr(np.array(img))
        if res and res[0]:
            for line in res[0]: raw += line[1][0] + "\n"
    
    # Split by numbers 1-90
    questions = [p.strip() for p in re.split(r'(?:\n|^)\s*\d+[\s\).\-]+', raw) if len(p.strip()) > 20]
    vectors = np.array(embed_model.encode(questions)).astype("float32")
    clusters = kmeans.predict(vectors)
    
    easy, med, hard = sum(clusters==0), sum(clusters==1), sum(clusters==2)
    diff_idx = (easy*0.2 + med*0.5 + hard*1.0) / len(questions)
    
    pred_mean = score_model.predict([[easy, med, hard, 8, np.mean([len(q) for q in questions]), diff_idx]])[0]
    sim_scores = np.clip(np.random.normal(pred_mean, 15, 10000), 0, 100)
    
    print(f"\n--- EquiGrade Maths Report ---")
    print(f"Predicted Board Mean: {round(pred_mean, 2)} / 100")
    print(f"95th Percentile Cut-off: {round(np.percentile(sim_scores, 95), 2)}")

analyze()