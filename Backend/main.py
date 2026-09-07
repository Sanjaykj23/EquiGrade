from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import concurrent.futures
import joblib
import numpy as np
import os
from utils.processor import analyze_document

app = FastAPI(title="EquiGrade Normalization API")

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
                
                raw_mark = subjects_data[sub]["marks"]
                sd = 8 if board == "CBSE" else 12
                
                # Normalization formula to 100-point scale
                normalized = ((raw_mark - predicted_mean) / sd) * 10 + 85
                
                results[sub] = {
                    "raw": raw_mark,
                    "paper_mean": round(predicted_mean, 2),
                    "normalized": round(float(np.clip(normalized, 0, 100)), 2),
                    "easy": int(features[0]),
                    "medium": int(features[1]),
                    "hard": int(features[2]),
                    "difficulty_index": round(float(features[5]), 2)
                }
            except Exception as e:
                print(f"Error predicting for {sub}: {str(e)}")
                results[sub] = {"error": str(e)}

    return results