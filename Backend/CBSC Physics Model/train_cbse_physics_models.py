import json
import numpy as np
import faiss
import joblib
import os
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

# Fix for OpenMP library conflicts on Windows
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading CBSE Physics dataset...")
try:
    with open("cbse_physics_dataset.json", "r", encoding="utf-8") as f:
        data = json.load(f)
except FileNotFoundError:
    print("Error: 'cbse_physics_dataset.json' not found. Run the extraction script first!")
    exit()

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

print("Generating embeddings (This may take a moment)...")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Concept Clustering (Mechanics, Electromagnetism, Modern Physics, etc.)
print("Clustering conceptual difficulty...")
kmeans = KMeans(n_clusters=3, random_state=42).fit(vectors)

# Optimization: Create a fast lookup for cluster labels
q_to_cluster = {q["question"]: kmeans.labels_[i] for i, q in enumerate(data)}

# Save FAISS Index for similarity searching
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "cbse_physics_vector_index.faiss")

# Synthetic Training for CBSE 70-mark format
print("Generating synthetic papers for scoring model...")
papers = []
for i in range(2000):
    sample = np.random.choice(data, 33) # Standard CBSE Physics question count
    c_list = [q_to_cluster[q["question"]] for q in sample]
    easy, med, hard = c_list.count(0), c_list.count(1), c_list.count(2)
    
    diff = (easy*0.3 + med*0.6 + hard*1.0) / 33
    # CBSE Scoring Logic: Base mean ~52/70, difficulty reduces it
    marks = 52 - (diff * 20) + (np.random.randint(2,8) * 0.5)
    
    papers.append([easy, med, hard, np.random.randint(2,8), np.mean([len(q["question"]) for q in sample]), diff, marks])

X, y = np.array(papers)[:, :-1], np.array(papers)[:, -1]
model = RandomForestRegressor(n_estimators=200).fit(X, y)

# Save the trained models
joblib.dump(model, "cbse_physics_score_model.pkl")
joblib.dump(kmeans, "cbse_physics_cluster_model.pkl")
print("CBSE Physics Models Saved Successfully!")