import json
import numpy as np
import faiss
import joblib
import os
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

# Optimization for Intel/LLVM OpenMP conflict
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading Chemistry dataset...")
with open("chemistry_state_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Tiering Chemistry questions (Organic, Inorganic, Physical complexity)
print("Clustering questions...")
kmeans = KMeans(n_clusters=3, random_state=42).fit(vectors)
q_to_cluster = {q["question"]: kmeans.labels_[i] for i, q in enumerate(data)}

# Save FAISS Index
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "chemistry_vector_index.faiss")

# Synthetic Training: State Board Chemistry is out of 70 marks
print("Generating synthetic papers for scoring model...")
papers = []
for i in range(2000):
    sample = np.random.choice(data, 38) # Standard State Board question count
    c_list = [q_to_cluster[q["question"]] for q in sample]
    easy, med, hard = c_list.count(0), c_list.count(1), c_list.count(2)
    
    diff = (easy*0.3 + med*0.6 + hard*1.0) / 38
    # Scoring Logic: Base mean ~48/70 for state board
    marks = 50 - (diff * 22) + (np.random.randint(2,10) * 0.4)
    
    papers.append([easy, med, hard, np.random.randint(2,10), np.mean([len(q["question"]) for q in sample]), diff, marks])

X, y = np.array(papers)[:, :-1], np.array(papers)[:, -1]
model = RandomForestRegressor(n_estimators=200).fit(X, y)

joblib.dump(model, "chemistry_score_model.pkl")
joblib.dump(kmeans, "chemistry_cluster_model.pkl")
print("Chemistry State Board Models Trained and Saved.")