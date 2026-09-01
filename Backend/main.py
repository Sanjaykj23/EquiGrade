from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import concurrent.futures
import joblib
import numpy as np
import os
from utils.processor import analyze_document # We will define this below

app = FastAPI()

# Enable CORS for your React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root directory for models based on your screenshot
MODEL_BASE_DIR = os.path.dirname(os.path.abspath(__file__))

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
    # Mapping subjects to their uploaded content
    subjects_data = {
        "physics": {"file": await physics.read(), "marks": physicsMarks},
        "chemistry": {"file": await chemistry.read(), "marks": chemistryMarks},
        "maths": {"file": await maths.read(), "marks": mathsMarks}
    }

    results = {}

    # Step 3: Run OCR and Analysis in Parallel to save time
    with concurrent.futures.ThreadPoolExecutor() as executor:
        future_to_sub = {
            executor.submit(analyze_document, subjects_data[sub]["file"], board, sub): sub 
            for sub in subjects_data
        }
        
        for future in concurrent.futures.as_completed(future_to_sub):
            sub = future_to_sub[future]
            try:
                # Get Easy/Med/Hard counts from OCR/AI
                features = future.result()
                
                # Determine model paths based on your Screenshot structure
                folder_prefix = "CBSC" if board == "CBSE" else "SB"
                model_path = os.path.join(MODEL_BASE_DIR, f"{folder_prefix} {sub.capitalize()} Model", f"{sub}_score_model.pkl")
                
                # Load Model and Predict Paper Mean
                model = joblib.load(model_path)
                predicted_mean = model.predict([features])[0]
                
                # Step 4: Normalization Logic
                # We calculate performance relative to the AI-predicted difficulty
                raw_mark = subjects_data[sub]["marks"]
                
                # Standard Deviation: CBSE is usually tighter (8), State Board wider (12)
                sd = 8 if board == "CBSE" else 12
                
                # Normalization formula to 100-point scale
                normalized = ((raw_mark - predicted_mean) / sd) * 10 + 85
                
                results[sub] = {
                    "raw": raw_mark,
                    "paper_mean": round(predicted_mean, 2),
                    "normalized": round(np.clip(normalized, 0, 100), 2)
                }
            except Exception as e:
                results[sub] = {"error": str(e)}

    return results