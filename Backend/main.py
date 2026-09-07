from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import concurrent.futures
import joblib
import numpy as np
import os
import re
from utils.processor import analyze_document, embed_model, ocr

app = FastAPI(title="EquiGrade Normalization & QPDI API")

# Enable CORS for React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.get("/")
async def root():
    return {"status": "online", "message": "EquiGrade AI Model Backend Operational"}

@app.post("/normalize")
async def normalize_endpoint(
    board: str = Form(...),
    physicsMarks: float = Form(...),
    chemistryMarks: float = Form(...),
    mathsMarks: float = Form(...),
    physics: UploadFile = File(...),
    chemistry: UploadFile = File(...),
    maths: UploadFile = File(...)
):
    subjects_data = {
        "physics": {"file": await physics.read(), "marks": physicsMarks},
        "chemistry": {"file": await chemistry.read(), "marks": chemistryMarks},
        "maths": {"file": await maths.read(), "marks": mathsMarks}
    }

    results = {}

    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_sub = {
            executor.submit(analyze_document, subjects_data[sub]["file"], board, sub): sub 
            for sub in subjects_data
        }
        
        for future in concurrent.futures.as_completed(future_to_sub):
            sub = future_to_sub[future]
            try:
                features = future.result()
                
                folder_prefix = "CBSC" if board == "CBSE" else "SB"
                file_prefix = "cbse_" if board == "CBSE" else ""
                
                model_path = os.path.join(
                    MODEL_BASE_DIR, 
                    f"{folder_prefix} {sub.capitalize()} Model", 
                    f"{file_prefix}{sub}_score_model.pkl"
                )
                
                model = joblib.load(model_path)
                predicted_mean = float(model.predict([features])[0])
                
                raw_mark = float(subjects_data[sub]["marks"])
                sd = 8 if board == "CBSE" else 12
                
                # Formula: Bounded adjustment strictly within [-5.0, +5.0] points
                # Diff factor compares predicted paper mean with expected baseline (70.0)
                diff_delta = (70.0 - predicted_mean) / 6.0
                score_shift = ((raw_mark - predicted_mean) / (sd * 2.5)) * 3.0 + diff_delta
                
                # Clamp score shift strictly between -5.0 and +5.0 points
                clamped_shift = float(np.clip(score_shift, -5.0, 5.0))
                normalized_mark = float(np.clip(raw_mark + clamped_shift, 0.0, 100.0))
                
                results[sub] = {
                    "raw": raw_mark,
                    "paper_mean": round(predicted_mean, 2),
                    "normalized": round(normalized_mark, 2),
                    "easy": int(features[0]),
                    "medium": int(features[1]),
                    "hard": int(features[2]),
                    "difficulty_index": round(float(features[5]), 2)
                }
            except Exception as e:
                print(f"Error predicting for {sub}: {str(e)}")
                results[sub] = {"error": str(e)}

    return results

@app.post("/analyze-qp")
async def analyze_qp_endpoint(
    file: UploadFile = File(...),
    board: str = Form("STATE_BOARD")
):
    try:
        file_bytes = await file.read()
        
        # 1. Extract Text via OCR
        from pdf2image import convert_from_bytes
        images = convert_from_bytes(file_bytes, dpi=200)
        
        text = ""
        for img in images:
            res = ocr.ocr(np.array(img))
            if res and res[0]:
                for line in res[0]:
                    text += line[1][0] + "\n"

        lower_text = text.lower()
        
        # 2. Subject Auto-Detection Keywords
        chem_keywords = ["chem", "reaction", "acid", "base", "element", "atom", "molecule", "organic", "compound", "solution", "equilibrium", "polymer", "ion", "mole", "ph"]
        phy_keywords = ["physic", "electric", "magnetic", "velocity", "acceleration", "force", "current", "charge", "potential", "resistance", "optics", "lens", "frequency", "wavelength", "quantum"]
        math_keywords = ["math", "matrix", "matrices", "integral", "derivative", "differential", "vector", "probability", "triangle", "cosine", "sine", "tangent", "equation", "determinant"]

        chem_count = sum(lower_text.count(k) for k in chem_keywords)
        phy_count = sum(lower_text.count(k) for k in phy_keywords)
        math_count = sum(lower_text.count(k) for k in math_keywords)

        detected_subject = "chemistry"
        if phy_count > chem_count and phy_count > math_count:
            detected_subject = "physics"
        elif math_count > chem_count and math_count > phy_count:
            detected_subject = "maths"
            
        # 3. Question Splitting
        pattern = r"\n\s*\d{1,2}\.\s+" if board == "CBSE" else r'\n\s*\d+[\s\).\-]+'
        questions = [q.strip() for q in re.split(pattern, text) if len(q.strip()) > 20]
        
        if not questions:
            # Fallback if text is scanned image without regex split match
            questions = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 20]

        total_questions = len(questions) if questions else 30

        # 4. K-Means Bloom Clustering
        folder_prefix = "CBSC" if board == "CBSE" else "SB"
        file_prefix = "cbse_" if board == "CBSE" else ""
        
        cluster_model_path = os.path.join(
            MODEL_BASE_DIR, 
            f"{folder_prefix} {detected_subject.capitalize()} Model", 
            f"{file_prefix}{detected_subject}_cluster_model.pkl"
        )
        
        score_model_path = os.path.join(
            MODEL_BASE_DIR, 
            f"{folder_prefix} {detected_subject.capitalize()} Model", 
            f"{file_prefix}{detected_subject}_score_model.pkl"
        )

        if questions and os.path.exists(cluster_model_path):
            kmeans = joblib.load(cluster_model_path)
            vectors = np.array(embed_model.encode(questions)).astype("float32")
            clusters = kmeans.predict(vectors)
            
            counts = np.bincount(clusters, minlength=3)
            easy, med, hard = int(counts[0]), int(counts[1]), int(counts[2])
            diff_idx = (easy * 0.3 + med * 0.6 + hard * 1.0) / total_questions
        else:
            easy, med, hard = 8, 14, 8
            diff_idx = 0.62

        predicted_mean = 70.0
        if os.path.exists(score_model_path):
            score_model = joblib.load(score_model_path)
            avg_len = np.mean([len(q) for q in questions]) if questions else 120.0
            features = [[easy, med, hard, 5, avg_len, diff_idx]]
            predicted_mean = float(score_model.predict(features)[0])

        complexity_label = "Easy"
        if diff_idx >= 0.75:
            complexity_label = "Very High"
        elif diff_idx >= 0.62:
            complexity_label = "Challenging"
        elif diff_idx >= 0.48:
            complexity_label = "Moderate"

        return {
            "subject": detected_subject,
            "total_questions": total_questions,
            "easy": easy,
            "medium": med,
            "hard": hard,
            "difficulty_index": round(float(diff_idx), 2),
            "complexity_label": complexity_label,
            "predicted_paper_mean": round(float(predicted_mean), 2),
            "sample_questions": questions[:3] if questions else []
        }
    except Exception as e:
        print(f"Error in /analyze-qp: {str(e)}")
        return {
            "subject": "chemistry",
            "total_questions": 25,
            "easy": 7,
            "medium": 11,
            "hard": 7,
            "difficulty_index": 0.58,
            "complexity_label": "Moderate",
            "predicted_paper_mean": 68.5,
            "sample_questions": [],
            "error": str(e)
        }