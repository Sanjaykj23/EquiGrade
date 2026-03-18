import os
import re
import json
import pytesseract
from pdf2image import convert_from_path

# --- UPDATED PATH FOR YOUR FOLDER STRUCTURE ---
# Updated to match your kjsan user profile
root_dataset_path = r"C:\Users\kjsan\OneDrive\Documents\FOSS Hack\Dataset\CBSC\Mathematics"
poppler_path = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

def clean_math_text(text):
    lines = text.split("\n")
    cleaned = []
    for line in lines:
        line = line.strip()
        if len(line) < 6: continue
        # Filtering CBSE metadata
        if any(w in line.lower() for w in ["page", "p.t.o.", "q.p. code", "series", "roll no"]): continue
        
        has_math = bool(re.search(r'[=+−×÷∫∑√πθαβγλ∆|\[\]]', line))
        has_vars = bool(re.search(r'[xyzabcmnpqijk]', line, re.IGNORECASE))
        has_nums = bool(re.search(r'\d', line))
        
        if has_math or has_nums or has_vars:
            cleaned.append(line)
    return "\n".join(cleaned)

def split_math_questions(text):
    # CBSE standard numbering 1 to 14
    pattern = r"(?:\n|^)\s*(\d{1,2})\.\s+"
    parts = re.split(pattern, text)
    questions = []
    for i in range(2, len(parts), 2):
        q = parts[i].strip()
        if len(q) > 25: questions.append(q)
    return questions

dataset = []
print("Starting Recursive CBSE Scan...")

# Walk through years: Maths 2022, 2023, etc.
for year_folder in os.listdir(root_dataset_path):
    year_path = os.path.join(root_dataset_path, year_folder)
    
    if os.path.isdir(year_path):
        year = re.search(r"20\d{2}", year_folder).group()
        print(f"\n--- Entering Year: {year} ---")
        
        for file in os.listdir(year_path):
            if file.endswith(".pdf"):
                print(f"Processing: {file}")
                full_path = os.path.join(year_path, file)
                
                # Higher DPI for CBSE fractions/symbols
                images = convert_from_path(full_path, dpi=300, poppler_path=poppler_path)
                raw_text = ""
                for img in images:
                    raw_text += pytesseract.image_to_string(img, lang="eng", config="--psm 6")
                
                cleaned = clean_math_text(raw_text)
                found_questions = split_math_questions(cleaned)
                
                for q in found_questions:
                    dataset.append({
                        "question": q,
                        "subject": "Mathematics",
                        "board": "CBSE",
                        "year": year,
                        "paper_code": file.split()[0] # e.g., "65-1-1"
                    })

# Deduplicate
unique = {item["question"].lower(): item for item in dataset}
final_list = list(unique.values())

with open("cbse_maths_dataset.json", "w", encoding="utf-8") as f:
    json.dump(final_list, f, indent=4)

print(f"\nExtraction Done! Total Unique CBSE Questions: {len(final_list)}")