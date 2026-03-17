import os
import re
import json
import pytesseract
from pdf2image import convert_from_path
from sentence_transformers import SentenceTransformer
from sklearn.ensemble import RandomForestRegressor
import joblib

# -----------------------------
# PATH SETTINGS
# -----------------------------

dataset_folder = r"C:\Users\kjsan\OneDrive\Documents\FOSS Hack\Dataset\State Board\Physics"

poppler_path = r"C:\Users\kjsan\Downloads\poppler-25.12.0\Library\bin"

pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# -----------------------------
# CLEAN TEXT FUNCTION
# -----------------------------

def clean_text(text):

    lines = text.split("\n")
    cleaned = []

    keywords = [
        "is","are","what","which","calculate","find",
        "define","state","give","derive","explain","obtain"
    ]

    for line in lines:

        line = line.strip()

        if len(line) < 5:
            continue

        # remove tamil characters
        if re.search(r'[\u0B80-\u0BFF]', line):
            continue

        # keep english lines
        if len(re.findall(r'[A-Za-z]', line)) < 5:
            continue

        # keep question-like lines
        if not any(word in line.lower() for word in keywords):
            continue

        cleaned.append(line)

    return "\n".join(cleaned)

# -----------------------------
# SPLIT QUESTIONS
# -----------------------------

def split_questions(text):

    # handles formats like 1., 1), (a), (i)
    pattern = r"(?:\d+\.\s|\d+\)\s|\([a-z]\)\s|\([ivx]+\)\s)"

    parts = re.split(pattern, text)

    questions = []

    for p in parts:

        p = p.strip()

        if len(p) < 15:
            continue

        questions.append(p)

    return questions

# -----------------------------
# EXTRACT TEXT FROM PDF
# -----------------------------

def extract_pdf_text(pdf_path):

    images = convert_from_path(pdf_path, poppler_path=poppler_path)

    text = ""

    for img in images:

        page_text = pytesseract.image_to_string(img, lang="eng", config="--psm 6")

        text += page_text

    return text



# -----------------------------
# DATASET GENERATION
# -----------------------------

dataset = []

print("Scanning PDFs...\n")

for file in os.listdir(dataset_folder):

    if not file.endswith(".pdf"):
        continue

    pdf_path = os.path.join(dataset_folder,file)

    print("Processing:",file)

    # detect year automatically
    year_match = re.search(r"20\d{2}",file)

    year = year_match.group() if year_match else "extra"

    # OCR extraction
    raw_text = extract_pdf_text(pdf_path)

    # cleaning
    cleaned = clean_text(raw_text)

    # question splitting
    questions = split_questions(cleaned)

    for q in questions:

        dataset.append({
            "question": q,
            "subject": "Physics",
            "board": "StateBoard",
            "year": year
        })

# remove duplicates
unique = {}

for item in dataset:
    q = item["question"].lower()
    unique[q] = item

dataset = list(unique.values())

print("\nTotal Unique Questions:", len(dataset))

# save dataset
with open("physics_state_dataset.json","w",encoding="utf-8") as f:
    json.dump(dataset,f,indent=4)