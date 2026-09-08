from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import concurrent.futures
import joblib
import numpy as np
import os
import re
from utils.processor import analyze_document, embed_model, ocr, extract_text_from_pdf_bytes, split_questions_advanced

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
    board: str = Form("STATE_BOARD"),
    manualSubject: str = Form("auto")
):
    try:
        file_bytes = await file.read()
        file_name = file.filename.lower() if file.filename else ""
        
        # 1. Extract Text via PyMuPDF (fitz) with OCR fallback
        text = extract_text_from_pdf_bytes(file_bytes)
        lower_text = text.lower() + " " + file_name
        
        # 2. Subject Auto-Detection or Manual Override
        if manualSubject and manualSubject != "auto":
            detected_subject = manualSubject.lower()
        else:
            phy_words = ['physics', 'physic', 'electric', 'magnetic', 'velocity', 'acceleration', 'force', 'current', 'charge', 'potential', 'resistance', 'optics', 'lens', 'frequency', 'wavelength', 'quantum', 'joule', 'volt', 'ampere', 'tesla', 'henry', 'farad', 'ohm', 'resistor', 'capacitor', 'circuit', 'galvanometer', 'refraction', 'reflection', 'photon', 'photoelectric', 'torque', 'momentum', 'kinetics', 'diffraction', 'interference']
            chem_words = ['chemistry', 'chem', 'reaction', 'acid', 'alkali', 'element', 'molecule', 'organic', 'inorganic', 'compound', 'molar', 'molarity', 'normality', 'molality', 'valency', 'stoichiometry', 'polymer', 'titration', 'isomer', 'isomerism', 'benzene', 'phenol', 'ether', 'aldehyde', 'ketone', 'carboxylic', 'amine', 'haloalkane', 'electrochemistry', 'thermodynamics', 'enthalpy']
            math_words = ['mathematics', 'math', 'maths', 'matrix', 'matrices', 'integral', 'integration', 'derivative', 'differentiation', 'differential', 'vector', 'vectors', 'probability', 'trigonometry', 'cosine', 'sine', 'tangent', 'determinant', 'calculus', 'algebra', 'geometry', 'parabola', 'hyperbola', 'ellipse', 'coordinate', 'eigenvalue', 'solve', 'evaluate', 'equation']

            phy_count = sum(len(re.findall(r'\b' + re.escape(w) + r'\b', lower_text)) for w in phy_words) + (10 if ("phy" in file_name or "physics" in file_name) else 0)
            chem_count = sum(len(re.findall(r'\b' + re.escape(w) + r'\b', lower_text)) for w in chem_words) + (10 if ("chem" in file_name or "chemistry" in file_name) else 0)
            math_count = sum(len(re.findall(r'\b' + re.escape(w) + r'\b', lower_text)) for w in math_words) + (10 if ("math" in file_name or "maths" in file_name or "mathematics" in file_name) else 0)

            if phy_count > chem_count and phy_count > math_count:
                detected_subject = "physics"
            elif math_count > chem_count and math_count > phy_count:
                detected_subject = "maths"
            elif chem_count > phy_count and chem_count > math_count:
                detected_subject = "chemistry"
            else:
                if "math" in file_name or "maths" in file_name:
                    detected_subject = "maths"
                elif "phy" in file_name or "physics" in file_name:
                    detected_subject = "physics"
                else:
                    detected_subject = "chemistry"
            
        # 3. Advanced Multi-Pass Question Extractor (Guarantees 15 to 45 questions scanned per paper)
        questions = split_questions_advanced(text, board)
        total_questions = len(questions) if questions else 30

        # 4. K-Means Bloom Clustering & Score Model
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
            diff_idx = (easy * 0.32 + med * 0.64 + hard * 1.0) / total_questions
        else:
            easy = Math.max(4, int(total_questions * 0.3)) if 'Math' in globals() else int(total_questions * 0.3)
            easy = int(total_questions * 0.3)
            med = int(total_questions * 0.5)
            hard = total_questions - (easy + med)
            diff_idx = (easy * 0.32 + med * 0.64 + hard * 1.0) / total_questions

        predicted_mean = 70.0
        if os.path.exists(score_model_path):
            score_model = joblib.load(score_model_path)
            avg_len = float(np.mean([len(q) for q in questions])) if questions else 120.0
            features = [[easy, med, hard, 5, avg_len, float(diff_idx)]]
            predicted_mean = float(score_model.predict(features)[0])
        else:
            base_mean = 72.0 if board == "CBSE" else 75.0
            predicted_mean = base_mean - (diff_idx - 0.5) * 15.0

        complexity_label = "Easy"
        if diff_idx >= 0.78:
            complexity_label = "Very High"
        elif diff_idx >= 0.63:
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
        raise HTTPException(status_code=500, detail=f"Error analyzing question paper: {str(e)}")