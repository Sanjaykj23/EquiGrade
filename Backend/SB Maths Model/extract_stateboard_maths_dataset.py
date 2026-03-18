import os
import re
import json
import pytesseract
from pdf2image import convert_from_path

# --- CONFIGURATION ---
dataset_folder = r"C:\Users\kjsan\OneDrive\Documents\FOSS Hack2k26\EquiGrade\Dataset\State Board\Maths"
poppler_path = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_math_text(text):
    lines = text.split("\n")
    cleaned = []
    for line in lines:
        line = line.strip()
        if len(line) < 5: continue
        # Filter watermarks
        if any(w in line.lower() for w in ["padasalai", "trbtnpsc", "gmail", "www."]): continue
        
        # Math Logic: Keep lines with operators, variables (x,y,z), or numbers
        has_math = bool(re.search(r'[=+−×÷∫∑√πθαβγλ∆|\[\]]', line))
        has_vars = bool(re.search(r'[xyzabcmnpqijk]', line, re.IGNORECASE))
        has_nums = bool(re.search(r'\d', line))
        
        # Filter Tamil-only text that lacks math symbols
        is_tamil_only = bool(re.search(r'[\u0B80-\u0BFF]', line)) and not (has_nums or has_vars)

        if (has_math or has_nums or has_vars) and not is_tamil_only:
            cleaned.append(line)
    return "\n".join(cleaned)

def split_math_questions(text):
    # Regex to catch State Board numbering (usually 1. to 90. or 100.)
    # Also catches sub-parts like (a) or (i)
    pattern = r"(?:\n|^)\s*(?:\d+[\.\)]|\([a-z]\)|\([ivx]+\))\s+"
    parts = re.split(pattern, text)
    return [p.strip() for p in parts if len(p.strip()) > 18]

dataset = []
print("Scanning State Board Maths PDFs...")

for file in os.listdir(dataset_folder):
    if file.endswith(".pdf"):
        print(f"Processing: {file}")
        images = convert_from_path(os.path.join(dataset_folder, file), dpi=300, poppler_path=poppler_path)
        raw_text = "".join([pytesseract.image_to_string(img, config="--psm 6") for img in images])
        
        questions = split_math_questions(clean_math_text(raw_text))
        year = re.search(r"20\d{2}", file).group() if re.search(r"20\d{2}", file) else "extra"
        
        for q in questions:
            dataset.append({"question": q, "subject": "Maths", "board": "StateBoard", "year": year})

unique = list({item["question"].lower(): item for item in dataset}.values())
with open("maths_state_dataset.json", "w", encoding="utf-8") as f:
    json.dump(unique, f, indent=4)
print(f"Saved {len(unique)} unique Math questions.")