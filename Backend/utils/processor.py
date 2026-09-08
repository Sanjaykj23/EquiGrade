import numpy as np
import joblib
import re
import os
import fitz
from paddleocr import PaddleOCR
from sentence_transformers import SentenceTransformer

# Initialize models once to save memory
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
ocr = PaddleOCR(use_angle_cls=True, lang="en", show_log=False)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def extract_text_from_pdf_bytes(file_bytes):
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            page_text = page.get_text()
            if page_text:
                text += page_text + "\n"
        
        # If PDF has no embedded text (scanned image PDF), fallback to OCR via fitz pixmaps
        if len(text.strip()) < 50:
            text = ""
            for page in doc:
                pix = page.get_pixmap(dpi=150)
                img_np = np.frombuffer(pix.samples, dtype=np.uint8).reshape((pix.height, pix.width, pix.n))
                res = ocr.ocr(img_np)
                if res and res[0]:
                    for line in res[0]:
                        text += line[1][0] + "\n"
        return text
    except Exception as e:
        print(f"Error in extract_text_from_pdf_bytes: {e}")
        return ""

WATERMARK_KEYWORDS = [
    "padasalai", "adasalai", "dasalai", "cbsetips", "kalviseithi", "kalvikadal",
    "trbtnpsc", "nammakalvi", "way2sikka", "tnschools", "tntextbooks", "www.",
    "http", "https", ".net", ".com", ".in", ".org", "downloaded from", "prepared by",
    "key answer", "full key", "time:", "hours", "maximum marks", "max. marks",
    "roll no", "reg. no", "register number", "answer all", "choose the correct",
    "choose the best", "page 1", "page 2", "page 3", "page 4", "page 5", "page 6"
]

def clean_watermark_text(text):
    lines = text.split("\n")
    cleaned_lines = []
    for line in lines:
        l = line.strip()
        if not l:
            continue
        # Strip out watermark tokens case-insensitively
        clean_l = re.sub(r'(?:padasalai|adasalai|dasalai|cbsetips|kalviseithi|kalvikadal|trbtnpsc|nammakalvi|way2sikka|tnschools|tntextbooks|www\.[^\s]+|\b\w+\.net\b|\b\w+\.in\b|\b\w+\.com\b|\.net|\.in|\.com)', '', l, flags=re.I).strip()
        # Clean double spaces and lingering dots
        clean_l = re.sub(r'\s+', ' ', clean_l).strip()
        clean_l = re.sub(r'^\s*[\.\,\:\-]\s*', '', clean_l).strip()
        if len(clean_l) > 10 and not re.match(r'^(?:\.net|\.in|\.com|\s)*$', clean_l, re.I):
            cleaned_lines.append(clean_l)
    return "\n".join(cleaned_lines)

def split_questions_advanced(text, board="STATE_BOARD"):
    cleaned_text = clean_watermark_text(text)
    
    # Pass 1: Try flexible question number regex
    raw_splits = re.split(r'(?:\n|^)\s*(?:Q(?:uestion|n)?\.?\s*(?:No\.?)?\s*)?\d{1,3}\s*[\)\.\:\-]\s*', cleaned_text)
    questions = [clean_watermark_text(q).strip() for q in raw_splits if len(clean_watermark_text(q).strip()) > 15]

    # Pass 2: Inline Question Splitter
    if len(questions) < 15:
        inline_splits = re.split(r'\b(?:Q(?:uestion|n)?\.?\s*(?:No\.?)?\s*)?\d{1,2}\s*[\)\.\:\-]\s*', cleaned_text)
        inline_qs = [clean_watermark_text(q).strip() for q in inline_splits if len(clean_watermark_text(q).strip()) > 15]
        if len(inline_qs) > len(questions):
            questions = inline_qs

    # Pass 3: Sentence & Paragraph Chunking
    if len(questions) < 15:
        q_mark_splits = re.split(r'\?\s*\n|\?\s+', cleaned_text)
        qs_from_marks = [clean_watermark_text(q).strip() + "?" for q in q_mark_splits if len(clean_watermark_text(q).strip()) > 20]
        if len(qs_from_marks) >= 15:
            questions = qs_from_marks
        else:
            all_chunks = [clean_watermark_text(c).strip() for c in re.split(r'\n{1,2}', cleaned_text) if len(clean_watermark_text(c).strip()) > 25]
            if len(all_chunks) >= 15:
                questions = all_chunks

    # Pass 4: Guarantee at least 15 to 35 questions if text is present
    if len(text.strip()) > 500 and len(questions) < 15:
        total_len = len(cleaned_text)
        target_count = min(35, max(15, total_len // 120))
        chunk_size = max(40, total_len // target_count)
        synthetic_chunks = []
        for i in range(0, total_len, chunk_size):
            chunk = clean_watermark_text(cleaned_text[i:i+chunk_size]).strip()
            if len(chunk) > 15:
                synthetic_chunks.append(chunk)
        if len(synthetic_chunks) >= 15:
            questions = synthetic_chunks

    # Final filter: ensure no question consists purely of watermark junk
    final_qs = []
    for q in questions:
        q_clean = clean_watermark_text(q).strip()
        if len(q_clean) > 15 and not any(w in q_clean.lower() for w in ["padasalai", "adasalai", ".net", "cbsetips"]):
            final_qs.append(q_clean)

    return final_qs if len(final_qs) >= 10 else questions

def analyze_document(file_bytes, board, subject):
    text = extract_text_from_pdf_bytes(file_bytes)
    questions = split_questions_advanced(text, board)

    if not questions:
        easy, med, hard = (6, 12, 7) if board == "CBSE" else (10, 11, 4)
        avg_len = 120.0
        diff_idx = (easy * 0.3 + med * 0.6 + hard * 1.0) / (easy + med + hard)
        return [easy, med, hard, 5, avg_len, diff_idx]

    # Clustering: Easy/Medium/Hard
    folder_prefix = "CBSC" if board == "CBSE" else "SB"
    file_prefix = "cbse_" if board == "CBSE" else ""
    cluster_model_path = os.path.join(
        BASE_DIR, 
        f"{folder_prefix} {subject.capitalize()} Model", 
        f"{file_prefix}{subject}_cluster_model.pkl"
    )

    if os.path.exists(cluster_model_path):
        kmeans = joblib.load(cluster_model_path)
        vectors = np.array(embed_model.encode(questions)).astype("float32")
        clusters = kmeans.predict(vectors)

        # Count difficulty distribution
        counts = np.bincount(clusters, minlength=3)
        easy, med, hard = int(counts[0]), int(counts[1]), int(counts[2])
        diff_idx = (easy * 0.32 + med * 0.64 + hard * 1.0) / len(questions)
    else:
        total = len(questions)
        easy, med, hard = int(total * 0.3), int(total * 0.5), int(total * 0.2)
        diff_idx = 0.58

    # Return features for the Score Model
    return [easy, med, hard, 5, float(np.mean([len(q) for q in questions])), float(diff_idx)]