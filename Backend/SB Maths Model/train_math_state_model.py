import json, numpy as np, faiss, joblib, os
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

print("Loading Maths dataset...")
with open("maths_state_dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

questions = [q["question"] for q in data]
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = np.array(embed_model.encode(questions)).astype("float32")

# Concept Clustering
kmeans = KMeans(n_clusters=3, random_state=42).fit(vectors)
q_to_cluster = {q["question"]: kmeans.labels_[i] for i, q in enumerate(data)}

# Save Index
index = faiss.IndexFlatL2(vectors.shape[1])
index.add(vectors)
faiss.write_index(index, "maths_vector_index.faiss")

# Synthetic Training for 90-100 Mark Papers
print("Training scoring model...")
papers = []
for i in range(2000):
    sample = np.random.choice(data, 90) # Higher question count for State Board
    c_list = [q_to_cluster[q["question"]] for q in sample]
    easy, med, hard = c_list.count(0), c_list.count(1), c_list.count(2)
    
    diff = (easy*0.2 + med*0.5 + hard*1.0) / 90
    marks = 85 - (diff * 40) # Maths scores have high variance 
    papers.append([easy, med, hard, np.random.randint(5,15), np.mean([len(q["question"]) for q in sample]), diff, marks])

model = RandomForestRegressor(n_estimators=200).fit(np.array(papers)[:, :-1], np.array(papers)[:, -1])
joblib.dump(model, "maths_score_model.pkl")
joblib.dump(kmeans, "maths_cluster_model.pkl")
print("Maths State Board Models Saved.")