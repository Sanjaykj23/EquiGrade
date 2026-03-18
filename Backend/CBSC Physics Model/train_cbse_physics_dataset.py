import os
import re
import json
import pytesseract
from pdf2image import convert_from_path

# --- CONFIGURATION ---
root_dataset_path = r"C:\Users\kjsan\OneDrive\Documents\FOSS Hack\Dataset\CBSC\Physics"
poppler_path = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_physics_text(text):
    lines = text.split("\n")
    cleaned = []
    keywords = ["force", "energy", "calculate", "derive", "circuit", "field", "is", "what", "ohm", "volt"]
    for line in lines:
        line = line.strip()
        if len(line) < 6 or any(w in line.lower() for w in ["page", "p.t.o.", "q.p. code", "series"]): continue
        if re.search(r'[\u0900-\u097F]', line) and not re.search(r'[A-Za-z0-9]', line): continue
        if any(k in line.lower() for k in keywords) or bool(re.search(r'\d', line)):
            cleaned.append(line)
    return "\n".join(cleaned)

def split_questions(text):
    pattern = r"(?:\n|^)\s*(\d{1,2})\.\s+"
    parts = re.split(pattern, text)
    return [parts[i].strip() for i in range(2, len(parts), 2) if len(parts[i].strip()) > 25]

dataset = []
print("Starting Optimized Physics Scan...")

for year_folder in os.listdir(root_dataset_path):
    year_path = os.path.join(root_dataset_path, year_folder)
    if os.path.isdir(year_path):
        year_match = re.search(r"20\d{2}", year_folder)
        year = year_match.group() if year_match else "extra"
        
        for file in os.listdir(year_path):
            if file.endswith(".pdf"):
                print(f"Processing: {year} - {file} (Extracting images...)")
                # Speed optimization: Changed DPI from 300 to 200
                images = convert_from_path(os.path.join(year_path, file), dpi=200, poppler_path=poppler_path)
                
                raw_text = ""
                for idx, img in enumerate(images):
                    print(f"  > OCR-ing Page {idx+1}/{len(images)}...", end="\r")
                    raw_text += pytesseract.image_to_string(img, config="--psm 6")
                
                print(f"\n  > Found {len(split_questions(clean_physics_text(raw_text)))} questions.")
                for q in split_questions(clean_physics_text(raw_text)):
                    dataset.append({"question": q, "subject": "Physics", "year": year})

# Deduplicate and Save
unique = list({item["question"].lower(): item for item in dataset}.values())
with open("cbse_physics_dataset.json", "w", encoding="utf-8") as f:
    json.dump(unique, f, indent=4)

print(f"\n--- SUCCESS ---")
print(f"Physics Dataset Saved: {len(unique)} questions in 'cbse_physics_dataset.json'.")