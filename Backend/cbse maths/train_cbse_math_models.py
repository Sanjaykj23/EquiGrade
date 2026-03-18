import json
import numpy as np
import faiss
import joblib
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor
import os

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading CBSE Maths dataset...")
with open("cbse_maths_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Concept Clustering
kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(vectors)
question_to_cluster = {q["question"]: clusters[i] for i, q in enumerate(data)}

# Save FAISS Index
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "cbse_maths_vector_index.faiss")

# Synthetic Training for CBSE Normalization
papers = []
for i in range(2000):
    sample = np.random.choice(data, 14) # CBSE standard 14 questions [cite: 593]
    sample_clusters = [question_to_cluster[q["question"]] for q in sample]
    easy, med, hard = sample_clusters.count(0), sample_clusters.count(1), sample_clusters.count(2)
    
    # CBSE Weighting: 40 Marks total. Difficulty significantly impacts high-mark questions [cite: 605, 618]
    diff = (easy*0.2 + med*0.5 + hard*1.0) / 14
    # CBSE Predicted Mean: Usually higher than State Board due to lower question volume
    marks = 34 - (diff * 15) 
    
    papers.append([easy, med, hard, np.random.randint(1,4), np.mean([len(q["question"]) for q in sample]), diff, marks])

X, y = np.array(papers)[:, :-1], np.array(papers)[:, -1]
model = RandomForestRegressor(n_estimators=200).fit(X, y)
joblib.dump(model, "cbse_maths_score_model.pkl")
joblib.dump(kmeans, "cbse_maths_cluster_model.pkl")
print("CBSE Maths Models Trained Successfully.")