import os
import re
import json
import pytesseract
from pdf2image import convert_from_path

# --- CONFIGURATION ---
dataset_folder = r"C:\Users\kjsan\OneDrive\Documents\FOSS Hack2k26\EquiGrade\Dataset\State Board\Chemistry"
poppler_path = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_chemistry_text(text):
    lines = text.split("\n")
    cleaned = []
    # Keywords for State Board Chemistry context
    keywords = ["reaction", "formula", "compound", "explain", "calculate", "structure", "element", "equation", "is", "what"]
    
    for line in lines:
        line = line.strip()
        if len(line) < 6: continue
        # Filter watermarks and headers
        if any(w in line.lower() for w in ["padasalai", "trbtnpsc", "register number", "printed pages"]):
            continue
        
        # Remove Tamil-only lines (unless they contain numbers/variables)
        has_vars = bool(re.search(r'[xyzabcmnpqijk]', line, re.IGNORECASE))
        has_nums = bool(re.search(r'\d', line))
        if re.search(r'[\u0B80-\u0BFF]', line) and not (has_vars or has_nums):
            continue

        if any(k in line.lower() for k in keywords) or has_nums or has_vars:
            cleaned.append(line)
    return "\n".join(cleaned)

def split_questions(text):
    # Matches numbering like 1., 2), (a), (i)
    pattern = r"(?:\n|^)\s*(?:\d+[\.\)]|\([a-z]\)|\([ivx]+\))\s+"
    parts = re.split(pattern, text)
    return [p.strip() for p in parts if len(p.strip()) > 20]

dataset = []
print("Starting State Board Chemistry Extraction...")

for file in os.listdir(dataset_folder):
    if file.endswith(".pdf"):
        print(f"Processing: {file}")
        try:
            images = convert_from_path(os.path.join(dataset_folder, file), dpi=200, poppler_path=poppler_path)
            raw_text = "".join([pytesseract.image_to_string(img, config="--psm 6") for img in images])
            
            cleaned = clean_chemistry_text(raw_text)
            found_questions = split_questions(cleaned)
            
            year = re.search(r"20\d{2}", file).group() if re.search(r"20\d{2}", file) else "extra"
            for q in found_questions:
                dataset.append({"question": q, "subject": "Chemistry", "board": "StateBoard", "year": year})
        except Exception as e:
            print(f"Error processing {file}: {e}")

unique = list({item["question"].lower(): item for item in dataset}.values())
with open("chemistry_state_dataset.json", "w", encoding="utf-8") as f:
    json.dump(unique, f, indent=4)

print(f"Done! Saved {len(unique)} unique questions to 'chemistry_state_dataset.json'.")